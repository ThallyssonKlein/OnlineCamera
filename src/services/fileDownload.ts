export function downloadFile(file: File): void {
  const fileUrl = URL.createObjectURL(file);
  const downloadLink = document.createElement("a");
  downloadLink.href = fileUrl;
  downloadLink.download = file.name;
  downloadLink.click();
  URL.revokeObjectURL(fileUrl);
}
