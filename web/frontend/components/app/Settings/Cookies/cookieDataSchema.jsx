
export const cookieSchema = function ( ressourcesProviderList, expires, cookieTypes ) {
    return [
        {
            label : "Name",
            tagType : "h3",
            propertyName : "name",
            type : "text",
            autoComplete : "off",
            multiline : false,
            sortable : true,
            visible : true,
            validator : null
        },
        {
            label : "Description",
            tagType : "p",
            propertyName : "description",
            type : "text",
            autoComplete : "off",
            multiline : 4,
            sortable : false,
            visible : true,
            validator : null
        },
        {
            label : "Path",
            tagType : "p",
            propertyName : "path",
            type : "text",
            autoComplete : "off",
            multiline : false,
            sortable : true,
            visible : true,
            validator : "urlPaht"
        },
        {
            label : "Domain",
            tagType : "p",
            propertyName : "domain",
            type : "text",
            autoComplete : "off",
            multiline : false,
            sortable : true,
            visible : true,
            validator : "domain"
        },
        {
            label : "Provider",
            tagType : "p",
            propertyName : "provider",
            type : "text",
            autoComplete : "off",
            multiline : false,
            sortable : true,
            visible : true,
            validator : null
        },
        {
            label : "Group",
            tagType : "p",
            propertyName : "group",
            type : ["select","create"],
            selectValues : () => ressourcesProviderList,
            autoComplete : "off",
            multiline : false,
            sortable : true,
            visible : true,
            validator : null
        },
        {
            label : "Source",
            tagType : "p",
            propertyName : "src",
            type : "string",
            selectValues : null,
            autoComplete : "off",
            multiline : false,
            sortable : false,
            visible : true,
            validator : "urlPath"
        },
        {
            label : "Deletable",
            tagType : null,
            propertyName : "deletable",
            type : "boolean",
            autoComplete : "off",
            multiline : false,
            sortable : false,
            visible : false,
            validator : null
        },
        {
            label : "Expires",
            tagType : "p",
            propertyName : "expires",
            type : "select",
            selectValues : () => expires,
            autoComplete : "off",
            multiline : false,
            sortable : false,
            visible : true,
            validator : "expires"
        },
        {
            label : "Type",
            tagType : "p",
            propertyName : "type",
            type : "select",
            selectValues : () => cookieTypes,
            autoComplete : "off",
            multiline : false,
            sortable : true,
            visible : true,
            validator : "type"
        },
        {
            label : "Recommendation",
            tagType : null,
            propertyName : "recommendation",
            type : null,
            selectValues : null,
            autoComplete : "off",
            multiline : false,
            sortable : false,
            visible : false,
            validator : null
        },
        {
            label : "Editable",
            tagType : null,
            propertyName : "editable",
            type : "boolean",
            selectValues : null,
            autoComplete : "off",
            multiline : false,
            sortable : false,
            visible : false,
            validator : null
        },
        {
            label : "Set",
            tagType : null,
            propertyName : "set",
            type : "number",
            selectValues : null,
            autoComplete : "off",
            multiline : false,
            sortable : false,
            visible : false,
            validator : null
        }
    ];
}
