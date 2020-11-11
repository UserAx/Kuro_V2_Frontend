export default (name) => {
    const fileNameChunks = (name.split('.')).reverse();
    return fileNameChunks[0];
}