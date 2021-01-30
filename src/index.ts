import fs from "fs";

export class MnistParser {
  imageSize = 28 * 28;

  normalizeValue(precision = 3) {
    const shifter = Math.pow(10, precision);
    return (value: number) => {
      if (value === 0) return 0;
      return Math.round((value / 255) * shifter) / shifter;
    };
  }

  parseFilenames(
    labelsFilename: string,
    imagesFilename: string,
    normalize = this.normalizeValue()
  ) {
    const labelsBuffer = fs.readFileSync(labelsFilename);
    const imagesBuffer = fs.readFileSync(imagesFilename);
    return this.parseBuffers(labelsBuffer, imagesBuffer, normalize);
  }

  parseBuffers(
    labelsBuffer: Buffer,
    imagesBuffer: Buffer,
    normalize = this.normalizeValue()
  ) {
    const labels = this.parseLabels(labelsBuffer);
    const images = this.parseImages(imagesBuffer);

    const map = new Map<number, number[][]>();
    for (let index = 0; index < labels.length; index++) {
      const label = labels[index];
      let start = index * this.imageSize;

      const range = images.slice(start, start + this.imageSize).map(normalize);

      let list = map.get(label);
      if (!list) {
        list = [];
        map.set(label, list);
      }

      list.push(range);
    }

    return map;
  }

  parseLabels(buffer: Buffer) {
    let version = 0;
    let start = 0;

    if (version !== 2049) {
      version = buffer.readInt32BE(0);
      start = 8;
    }

    const values: number[] = [];
    for (let index = start; index < buffer.length; index++) {
      values.push(buffer.readUInt8(index));
    }

    return values;
  }

  parseImages(buffer: Buffer) {
    let version = 0;
    let start = 0;

    if (version !== 2051) {
      version = buffer.readInt32BE(0);

      start = 16;
    }

    const values: number[] = [];
    for (let index = start; index < buffer.length; index++) {
      values.push(buffer.readUInt8(index));
    }

    return values;
  }
}

export default new MnistParser();