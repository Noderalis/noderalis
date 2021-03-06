import { SubscribeFieldConfig } from './subscriptionType';
/**
 * Add one field to the Subscription type
 */
export declare function subscriptionField<FieldName extends string>(fieldName: FieldName, config: SubscribeFieldConfig<'Subscription', FieldName> | (() => SubscribeFieldConfig<'Subscription', FieldName>)): import("./extendType").EngramExtendTypeDef<"Subscription">;
