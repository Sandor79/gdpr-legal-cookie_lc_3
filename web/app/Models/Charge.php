<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

/**
 * Responsible for reprecenting a charge record.
 *
 * @property int $id
 * @property int $charge_id
 * @property bool $test
 * @property string $status
 * @property string $name
 * @property string $terms
 * @property int $type
 * @property float $price
 * @property float $capped_amount
 * @property int $trial_days
 * @property Carbon $billing_on
 * @property Carbon $activated_on
 * @property Carbon $trial_ends_on
 * @property Carbon $cancelled_on
 * @property Carbon $expires_on
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon $deleted_at
 * @property int $shop_id
 * @property int $plan_id
 * @property string $description
 * @property int $reference_charge
 *
 * @property Plan $plan
 * @property Shop $shop
 *
 * @method Builder withTrashed()
 *
 * @mixin Builder
 */
class Charge extends Model
{
    use SoftDeletes;

    // Types of charges
    public const CHARGE_RECURRING = 1;
    public const CHARGE_ONETIME = 2;
    public const CHARGE_USAGE = 3;
    public const CHARGE_CREDIT = 4;

    // Types of statuses
    public const STATUS_ACTIVE = 'active';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_DECLINED = 'declined';
    public const STATUS_CANCELLED = 'cancelled';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'type',
        'shop_id',
        'charge_id',
        'plan_id',
        'status',
    ];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'type'          => 'int',
        'test'          => 'bool',
        'charge_id'     => 'string',
        'shop_id'       => 'int',
        'capped_amount' => 'float',
        'price'         => 'float',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * Gets the shop for the charge.
     */
    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    /**
     * Gets the plan.
     */
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Gets the charge's data from Shopify.
     *
     * @return object
     */
    public function retrieve()
    {
        $path = null;
        switch ($this->type) {
            case self::CHARGE_CREDIT:
                $path = 'application_credits';
                break;
            case self::CHARGE_ONETIME:
                $path = 'application_charges';
                break;
            default:
                $path = 'recurring_application_charges';
                break;
        }

        return $this
            ->shop
            ->api()
            ->rest('GET', "/admin/{$path}/{$this->charge_id}.json")->body->{substr($path, 0, -1)};
    }

    /**
     * Checks if the charge is a test.
     *
     * @return bool
     */
    public function isTest()
    {
        return (bool) $this->test;
    }

    /**
     * Checks if the charge is a type.
     *
     * @param int $type The charge type.
     *
     * @return bool
     */
    public function isType(int $type)
    {
        return (int) $this->type === $type;
    }

    /**
     * Checks if the charge is a trial-type charge.
     *
     * @return bool
     */
    public function isTrial()
    {
        return !is_null($this->trial_ends_on);
    }

    /**
     * Checks if the charge is currently in trial.
     *
     * @return bool
     */
    public function isActiveTrial()
    {
        return $this->isTrial() && Carbon::today()->lte(Carbon::parse($this->trial_ends_on));
    }

    /**
     * Returns the remaining trial days.
     *
     * @return int
     */
    public function remainingTrialDays()
    {
        if (!$this->isTrial()) {
            return;
        }

        return $this->isActiveTrial() ? Carbon::today()->diffInDays($this->trial_ends_on) : 0;
    }

    /**
     * Returns the remaining trial days from cancellation date.
     *
     * @return int
     */
    public function remainingTrialDaysFromCancel()
    {
        if (!$this->isTrial()) {
            return;
        }

        $cancelledDate = Carbon::parse($this->cancelled_on);
        $trialEndsDate = Carbon::parse($this->trial_ends_on);

        // Ensure cancelled date happened before the trial was supposed to end
        if ($this->isCancelled() && $cancelledDate->lte($trialEndsDate)) {
            // Diffeence the two dates and subtract from the total trial days to get whats remaining
            return $this->trial_days - ($this->trial_days - $cancelledDate->diffInDays($trialEndsDate));
        }

        return 0;
    }

    /**
     * return the date when the current period has begun.
     *
     * @return string
     */
    public function periodBeginDate()
    {
        $pastPeriods = (int) (Carbon::parse($this->activated_on)->diffInDays(Carbon::today()) / 30);
        $periodBeginDate = Carbon::parse($this->activated_on)->addDays(30 * $pastPeriods)->toDateString();

        return $periodBeginDate;
    }

    /**
     * return the end date of the current period.
     *
     * @return string
     */
    public function periodEndDate()
    {
        return Carbon::parse($this->periodBeginDate())->addDays(30)->toDateString();
    }

    /**
     * Returns the remaining days for the current recurring charge.
     *
     * @return int
     */
    public function remainingDaysForPeriod()
    {
        $pastDaysForPeriod = $this->pastDaysForPeriod();
        if (is_null($pastDaysForPeriod)) {
            return 0;
        }

        if ($pastDaysForPeriod == 0 && Carbon::parse($this->cancelled_on)->lt(Carbon::today())) {
            return 0;
        }

        return 30 - $pastDaysForPeriod;
    }

    /**
     * Returns the past days for the current recurring charge.
     *
     * @return int|null
     */
    public function pastDaysForPeriod()
    {
        if ($this->cancelled_on && abs(Carbon::now()->diffInDays(Carbon::parse($this->cancelled_on))) > 30) {
            return;
        }

        $pastDaysInPeriod = Carbon::parse($this->periodBeginDate())->diffInDays(Carbon::today());

        return $pastDaysInPeriod;
    }

    /**
     * Checks if plan was cancelled and is expired.
     *
     * @return bool
     */
    public function hasExpired()
    {
        if ($this->isCancelled()) {
            return Carbon::parse($this->expires_on)->lte(Carbon::today());
        }

        return false;
    }

    /**
     * Returns the used trial days.
     *
     * @return int|null
     */
    public function usedTrialDays()
    {
        if (!$this->isTrial()) {
            return;
        }

        return $this->trial_days - $this->remainingTrialDays();
    }

    /**
     * Checks the status of the charge.
     *
     * @param string $status The status to check.
     *
     * @return bool
     */
    public function isStatus(string $status)
    {
        return $this->status === $status;
    }

    /**
     * Checks if the charge is active.
     *
     * @return bool
     */
    public function isActive()
    {
        return $this->isStatus(self::STATUS_ACTIVE);
    }

    /**
     * Checks if the charge was accepted (for one-time and reccuring).
     *
     * @return bool
     */
    public function isAccepted()
    {
        return $this->isStatus(self::STATUS_ACCEPTED);
    }

    /**
     * Checks if the charge was declined (for one-time and reccuring).
     *
     * @return bool
     */
    public function isDeclined()
    {
        return $this->isStatus(self::STATUS_DECLINED);
    }

    /**
     * Checks if the charge was cancelled.
     *
     * @return bool
     */
    public function isCancelled()
    {
        return !is_null($this->cancelled_on) || $this->isStatus(self::STATUS_CANCELLED);
    }

    /**
     * Checks if the charge is "active" (non-API check).
     *
     * @return bool
     */
    public function isOngoing()
    {
        return $this->isActive() && !$this->isCancelled();
    }

    /**
     * Cancels this charge.
     *
     * @throws Exception
     *
     * @return self
     */
    public function cancel()
    {
        if (!$this->isType(self::CHARGE_ONETIME) && !$this->isType(self::CHARGE_RECURRING)) {
            throw new Exception('Cancel may only be called for single and recurring charges.');
        }

        $this->status = self::STATUS_CANCELLED;
        $this->cancelled_on = Carbon::today()->format('Y-m-d');
        $this->expires_on = Carbon::today()->addDays($this->remainingDaysForPeriod())->format('Y-m-d');

        return $this->save();
    }
}
