import moment from "moment-timezone";

const time = moment
    .tz(Date.now(), "Asia/Ho_Chi_Minh")
    .format("DD/MM/YYYY HH:mm:ss");

const createDate = {
    type: String,
    default: time,
};

const updateDate = {
    type: String,
    default: time,
};

export { createDate, updateDate };
