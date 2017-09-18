import axios from 'axios';
import { inflate } from 'pako';
import { SmartBuffer } from 'smart-buffer';

export interface Room {
    version: number;
    id: string;
    name: string;
    players: number;
    maxPlayers: number;
    hasPassword: boolean;
    country: string;
    latitude: number;
    longitude: number;
};

const domain = 'http://www.haxball.com/';
const referer = domain + 'index.html';
const url = domain + 'list3';

const readString = function (buffer: SmartBuffer): string {
    const length = buffer.readUInt16BE();
    return buffer.readString(length);
};

const getRawRoomData = function (url: string): Promise<Uint8Array> {
    const config = {
        headers: { referer },
        responseType: 'arraybuffer'
    };

    return axios.get(url, config)
        .then(response => inflate(response.data));
};

const parseRoom = function (buffer: SmartBuffer): Room {
    return {
        version: buffer.readUInt16BE(),
        id: readString(buffer),
        name: readString(buffer),
        players: buffer.readUInt8(),
        maxPlayers: buffer.readUInt8(),
        hasPassword: buffer.readUInt8() == 1,
        country: readString(buffer),
        latitude: buffer.readFloatBE(),
        longitude: buffer.readFloatBE()
    };
};

export const fetchRooms = async function (): Promise<Room[]> {
    const roomData = await getRawRoomData(url);
    const buffer = SmartBuffer.fromBuffer(new Buffer(roomData));
    const rooms: Room[] = [];

    buffer.skip(5);

    while (buffer.remaining()) {
        buffer.skip(2);
        rooms.push(parseRoom(buffer));
    }

    return rooms;
};
