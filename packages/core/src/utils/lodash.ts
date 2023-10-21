import _ from 'lodash';

export function removeNilFromObject<T = any>(obj: T): T {
  return _.omitBy(obj, _.isNil) as T;
}
