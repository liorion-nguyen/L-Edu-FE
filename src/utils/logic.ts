export const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B+";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M+";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K+";
    return num;
};

export const initialsName = (name: string) => {
    return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}