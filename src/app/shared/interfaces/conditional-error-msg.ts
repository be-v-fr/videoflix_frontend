/**
 * Represents an error message that is connected to a certain condition.
 * The condition an be used for more dynamic handling of error display logic.
 */
export interface ConditionalErrorMsg {
    condition: boolean | null;
    msg: string;
}