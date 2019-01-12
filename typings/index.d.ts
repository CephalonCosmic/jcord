// Type definitions for jcord
// Definitions by:
//   boltxyz <bolt8bp@gmail.com> (https://github.com/boltxyz)
// License: MIT

declare module "jcord" {
  import { EventEmitter } from "events";
  import { Stream, Readable, Writable } from "stream";
  export const version: string;

  // Classes
  export class Client extends EventEmitter {
    constructor(options?: object);
  }

  // Typedefs

  type CHANNEL_TYPES = "text" | "dm" | "voice" | "groupdm" | "category";
}
