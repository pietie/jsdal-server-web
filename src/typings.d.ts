// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;



declare function moment(...any): any;

declare var humanizeDuration: (...any) => any;

interface JWT {
    token: string;
    expiresEpoch: number;
}

