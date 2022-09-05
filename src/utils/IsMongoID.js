const REGEX_FOR_MONGO_ID = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i

const isMongoID = (string) => REGEX_FOR_MONGO_ID.test(string)

export default isMongoID
