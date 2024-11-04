export function getFormattedNetworkName(network: string): string {
  const formattedNetwork = network
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return formattedNetwork;
}
