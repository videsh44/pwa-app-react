export const isIOSDevice = () => {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
}
