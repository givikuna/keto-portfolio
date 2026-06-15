import * as fs from "fs";
import * as path from "path";

export class IDMachine {
    public static inc(): string {
        const data: [[number, number], [number, number, number]] = ((
            s: string[],
        ): [[number, number], [number, number, number]] => [
            [s[0], s[1]].map((letter: string): number => letter.codePointAt(0)!) as [
                number,
                number,
            ],
            [s[2], s[3], s[4]].map((c: string): number => parseInt(c.charAt(0))) as [
                number,
                number,
                number,
            ],
        ])(fs.readFileSync(path.join(__dirname, "./latest.txt")).toString().trim().split(""));

        const strings: [number, number] = data[0];
        const numbers: [number, number, number] = data[1];

        if (numbers[2] !== 9) {
            numbers[2]++;
        } else if (numbers[1] !== 9) {
            numbers[1]++;
            numbers[2] = 0;
        } else if (numbers[0] !== 9) {
            numbers[0]++;
            numbers[1] = numbers[2] = 0;
        } else if (strings[1] !== 90) {
            strings[1]++;
            numbers.fill(0);
        } else {
            strings[0]++;
            strings[1] = 65;
            numbers.fill(0);
        }

        const newID: string = this.restring(strings).join("") + numbers.join("");

        fs.writeFileSync(path.join(__dirname, "./latest.txt"), newID, "utf-8");

        return newID;
    }

    private static restring(xs: [number, number]): [string, string] {
        return xs.map((n: number): string => String.fromCodePoint(n)) as [string, string];
    }
}
