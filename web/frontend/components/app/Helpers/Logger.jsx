
export default (()=> {
    window.BC_LogLevel = window.BC_LogLevel || null;
    class _LOGGER {
        logData;
        logLevel = [];
        logDataDefined;

        constructor() {
            this.logData = {};
            this.logDataDefined = false;
            this.startedGroups = [];
            this.groupData = {}
            this.groupEnds = false;

            this.logLevel[this.logLevel["PRODUCTION"] = 0] = "PRODUCTION";
            this.logLevel[this.logLevel["INFO"] = 1] = "INFO";
            this.logLevel[this.logLevel["WARN"] = 2] = "WARN";
            this.logLevel[this.logLevel["ERROR"] = 3] = "ERROR";
            this.logLevel[this.logLevel["DEBUG"] = 4] = "DEBUG";

            const ctx = this;

            if (this.logDataDefined === false) {
                this.logDataDefined = true;
                Object.defineProperty(window, 'BC_LogLevel', {
                    set(val) {
                        if (typeof val === 'string' && typeof ctx.logLevel[val.toUpperCase()] === 'number') {
                            val = ctx.logLevel[ctx.logLevel[val.toUpperCase()]];
                        } else if (typeof val === 'number' && typeof ctx.logLevel[val] === 'string') {
                            val = ctx.logLevel[val];
                        } else {
                            let message = '';
                            message = (typeof val === 'string' || typeof val === 'number') ? `value: ${val}` : `typeof: ${Object.prototype.toString.call(val)}`;
                            message += ` not supported. Run window.BC_LOGGER.getInfo() for more information.`;
                            ctx.WARN(message);
                            return false;
                        }
                        localStorage.setItem('BC_LogLevel', val);
                        this.value = val;
                        ctx.INFO( `Change log level to "${ val }"`);
                        ctx.printCacheData();
                        return true;
                    },

                    get() {
                        return ctx.getLevelString( this.value );
                    }
                });

            }

            if (!!localStorage.getItem('BC_LogLevel') && !!window) {
                window.BC_LogLevel = localStorage.getItem('BC_LogLevel');
                ctx.INFO("Restore LogLevel from localStorage", "Run window.BC_LOGGER.getInfo() for more information")
            }
            window.BC_LogLevel = ( ctx.getCurrentLogLevelNumber() > 0 ? ctx.getLevelString( window.BC_LogLevel ) : ctx.getLevelString( 4 ));
        }


        getCurrentLogLevelNumber() {
            return this.getLevelNumber( this.logLevel[ window.BC_LogLevel ] )
        }
        getLevelNumber( level ){
            if (typeof level === 'string' && typeof this.logLevel[level.toUpperCase()] === 'number') {
                return this.logLevel[level.toUpperCase()];
            } else if (typeof level === 'number' && typeof this.logLevel[level] === 'string') {
                return level;
            }
        }
        getLevelString( level ){
            if (typeof level === 'string' && typeof this.logLevel[level.toUpperCase()] === 'number') {
                return level.toUpperCase();
            } else if (typeof level === 'number' && typeof this.logLevel[level] === 'string') {
                return this.logLevel[ level ];
            }
        }

        Logger({level, msg}) {
            const isProduction = this.getCurrentLogLevelNumber() === 0;

            if ( this.getLevelNumber(level) === 1 && !isProduction) {
                console.log( msg );
            } else if ( this.getLevelNumber(level) === 2) {
                console.warn( msg );
            } else if ( this.getLevelNumber(level) === 3) {
                console.error( msg );
            } else if ( this.getLevelNumber(level) === 4 && !isProduction) {
                console.debug( msg );
            } else {
                if (!this.logData[ level ]) {
                    this.logData[ level ] = [];
                }
                this.logData[ level ].push({level, msg});
            }
        }

        prepareData(level, data) {
            level = this.getLevelString( level );
            let match, callerName, callerPlace, stackTrace, msg;
            msg = { ...data };

            if ( this.getCurrentLogLevelNumber() > 1) {

                stackTrace = (new Error()).stack; // Only tested in latest FF and Chrome

                try {
                    match = stackTrace.match(/at Object\.(\w+) \((\S+)\)/);
                    match[1] // throw error if match is null
                    callerName = match[1];
                    callerPlace = match[2];
                } catch {
                    // Firefox
                    match = stackTrace.match(/\n(\w+)@(\S+)/);
                }
                if ( !!callerName && callerName !== "LOG" && callerName !== "DEBUG" && callerName !== "INFO" ) {
                    msg = {
                        time: Date.now(),
                        callerName,
                        callerPlace,
                        stackTrace,
                        msg: { ...data },
                        level
                    }
                }
            }
            if ( this.startedGroups.length > 0 ) {
                const groupeName = this.startedGroups.shift();
                if ( !this.groupData[ groupeName ] ) {
                    this.groupData[ groupeName ] = [];
                }
            }
            this.Logger({level, msg})
        }

        getCachedData( level ) {
            if ( !!this.logData[ this.getLevelString( level ) ] ) {
                return this.logData[ this.getLevelString( level ) ]
            }
            return [];
        }

        printCacheData() {

            let cachedLogData = [];

            if (this.getCurrentLogLevelNumber() >= 1) {
                cachedLogData = [ ...this.getCachedData( 1 ) ]
            }
            if (this.getCurrentLogLevelNumber() >= 2) {
                cachedLogData = [cachedLogData, ...this.getCachedData( 2 ) ]
            }
            if (this.getCurrentLogLevelNumber() >= 3) {
                cachedLogData = [cachedLogData, ...this.getCachedData( 3 ) ]
            }
            if (this.getCurrentLogLevelNumber() === 4) {
                cachedLogData = [cachedLogData, ...this.getCachedData( 4 ) ]
            }

            while (cachedLogData.length > 0) {
                this.Logger(cachedLogData.shift());
            }
        }

        getInfo() {
            console.groupCollapsed("BC_LOGGER info")
            console.groupCollapsed("command")
            console.groupCollapsed("Log commands")
            console.dir({
                "BC_LOGGER.INFO( message )": "Print any messages on LogLevel 1 equal LogLevel 'INFO'",
                "BC_LOGGER.WARM( message )": "Print any messages on LogLevel 2 equal LogLevel 'WARM' or with LogLevel 0 equal 'PRODUCTION",
                "BC_LOGGER.ERROR( message )": "Print any messages on LogLevel 3 equal LogLevel 'ERROR' or with LogLevel 0 equal 'PRODUCTION",
                "BC_LOGGER.LOG( message )": "Print any messages on LogLevel 4 equal LogLevel 'DEBUG'",
                "BC_LOGGER.DEBUG( message )": "Print any messages on LogLevel 4 equal LogLevel 'DEBUG'"
            });
            console.log("You can add any messages or multiple messages exp:",
                "BC_LOGGER.INFO( 'Foo' )",
                "BC_LOGGER.INFO( { foo : 'Foo' } )",
                "BC_LOGGER.INFO( 'Foo', 'Bar' )",
                "BC_LOGGER.INFO( ['Foo', 'Bar'] )"
            )
            console.groupEnd()

            console.groupCollapsed("other commands")
            console.dir({
                "BC_LOGGER.setLogLevel( level )": "Set new LogLevel and print any logs with available LogLevel. This stor the LogLevel in the LocalStorage and override 'PRODUCTION' LogLevel.",
                "BC_LOGGER.destroy()": "Clear any LocalStorage infos from BC_LOGGER."
            })
            console.groupEnd()
            console.groupEnd()
            console.groupCollapsed("Available log levels")
            console.table( this.logLevel)
            console.groupEnd()
            console.groupEnd()
        }

        INFO() {
            this.prepareData( this.logLevel[1], arguments )
        }

        WARN() {
            this.prepareData( this.logLevel[2], arguments )
        }

        ERROR() {
            this.prepareData( this.logLevel[3], arguments )
        }

        LOG() {
            this.prepareData( this.logLevel[4], arguments )
        }

        DEBUG() {
            this.prepareData( this.logLevel[4], arguments )
        }
        uid () {
            return "uid__" + String(
                Date.now().toString(32) +
                Math.random().toString(16)
            ).replace(/\./g, '')
        }
        group ( name = this.uid() ) {
            this.startedGroups.push( name )
        }
        groupEnd () {
            this.groupEnds = true;
        }

        setLogLevel( level ) {
            window.BC_LogLevel = level;
        }

        destroy() {
            localStorage.removeItem("BC_LogLevel") && (this.logData = {})
        }
    }

    function LOGGER () {
        const _logger = new _LOGGER();

        return {
            group : function () {
                _logger.group( ...arguments )
            },
            groupEnd : function () {
                _logger.groupEnd()
            },
            INFO : function() {
                _logger.INFO( ...arguments )
            },
            WARN : function() {
                _logger.WARN( ...arguments )
            },
            ERROR : function() {
                _logger.ERROR( ...arguments )
            },
            LOG : function() {
                _logger.LOG( ...arguments )
            },
            DEBUG : function() {
                _logger.DEBUG( ...arguments )
            },
            setLogLevel : function() {
                _logger.setLogLevel( ...arguments )
            },
            destroy : () => _logger.destroy(),
            getInfo : () => _logger.getInfo()
        }
    }
    return new LOGGER();
})();
