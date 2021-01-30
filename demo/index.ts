import mnistParser from "../src";

const imageMap = mnistParser.parseFilenames(
  `${__dirname}/train-labels-idx1-ubyte`,
  `${__dirname}/train-images-idx3-ubyte`
);

for (const [label, images] of imageMap) {
  console.info(`${label} with ${images.length} images`);
}