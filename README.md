# Haxball Roomlist Parser

Parses the [haxball](http://haxball.com) room list

## Usage

```ts
import { fetchRooms, Room } from 'haxball-roomlist-parser';

/* interface Room {
    version: number;
    id: string;
    name: string;
    players: number;
    maxPlayers: number;
    hasPassword: boolean;
    country: string;
    latitude: number;
    longitude: number;
} */

fetchRooms().then((rooms: Room[]) => {
    console.log(rooms);
});
```