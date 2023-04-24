import { decodeTime, encodeTime } from 'ulid';

export const getCurrent = () => encodeTime(new Date().getTime(), 10) + '0000000000000000';
export const getNewerThan = (ulid: string) => encodeTime(decodeTime(ulid) + 1, 10) + '0000000000000000';
export const getOlderThan = (ulid: string) => encodeTime(decodeTime(ulid) - 1, 10) + '0000000000000000';

const UlidHelper = {
	getCurrent,
	getNewerThan,
	getOlderThan,
};

export default UlidHelper;
