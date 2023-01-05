<?php

namespace App\Models;

use App\Http\Controllers\ApplicationChargeController;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * Responsible for reprecenting a plan record.
 *
 * @property int $id
 * @property int $type
 * @property string $name
 * @property float $price
 * @property float $capped_amount
 * @property string $terms
 * @property int $trial_days
 * @property bool $test
 * @property bool $on_install
 * @property bool $additional
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @mixin Builder
 */
class Plan extends Model
{
    // Types of plans
    private static int $PLAN_RECURRING = 1;
    private static int $PLAN_ONETIME = 2;


    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'type'          => 'int',
        'test'          => 'bool',
        'on_install'    => 'bool',
        'additional'    => 'bool',
        'capped_amount' => 'float',
        'price'         => 'float',
    ];

    public function getCurrencyCode(): string
    {
        return "USD";
    }
    public function isRecurring(): bool
    {
        return $this->type === self::$PLAN_RECURRING;
    }
    /**
     * Get charges.
     *
     * @return HasMany
     */
    public function charges(): HasMany
    {
        return $this->hasMany(Charge::class);
    }

    /**
     * Checks the plan type.
     *
     * @param int $type The plan type.
     *
     * @return bool
     */
    public function isType(int $type): bool
    {
        return $this->type === $type;
    }

    /**
     * Returns the plan type as a string (for API).
     *
     * @param bool $plural Return the plural form or not.
     *
     * @return string
     */
    public function typeAsString(bool $plural): string
    {
        $type = null;
        switch ($this->type) {
            case self::$PLAN_ONETIME:
                $type = 'application_charge';
                break;
            default:
            case self::$PLAN_RECURRING:
                $type = 'recurring_application_charge';
                break;
        }

        return $plural ? "{$type}s" : $type;
    }

    /**
     * Checks if this plan has a trial.
     *
     * @return bool
     */
    public function hasTrial(): bool
    {
        return $this->trial_days !== null && $this->trial_days > 0;
    }

    /**
     * Checks if this plan should be presented on install.
     *
     * @return bool
     */
    public function isOnInstall(): bool
    {
        return (bool) $this->on_install;
    }

    /**
     * Checks if this plan should not override current shop's plan
     *
     * @return bool
     */
    public function isAdditional(): bool
    {
        return (bool) $this->additional && $this->isType(self::$PLAN_ONETIME);
    }

    /**
     * Checks if the plan is a test.
     *
     * @return bool
     */
    public function isTest(): bool
    {
        return (bool) env('SHOPIFY_BILLING_TEST_MODE');
    }

    public function setTrialDays($days)
    {
        $this->attributes['trial_days'] = $days;
        $this->original['trial_days'] = $days;
    }

    public function setTerms($terms)
    {
        $this->attributes['terms'] = $this->attributes['terms'] . ' ' . $terms;
        $this->original['terms'] = $this->original['terms'] . ' ' . $terms;
    }
}
