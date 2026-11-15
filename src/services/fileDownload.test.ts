import { downloadFile } from "@services/fileDownload";

describe("downloadFile", () => {
  it("should click a download link named after the file and release the object URL", () => {
    const createObjectURL = jest.fn().mockReturnValue("blob:photo");
    const revokeObjectURL = jest.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
    const clickedLinks: HTMLAnchorElement[] = [];
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {
        clickedLinks.push(this);
      });
    const photo = new File(["data"], "photo.jpeg", { type: "image/jpeg" });

    downloadFile(photo);

    expect(createObjectURL).toHaveBeenCalledWith(photo);
    expect(clickedLinks).toHaveLength(1);
    expect(clickedLinks[0].download).toBe("photo.jpeg");
    expect(clickedLinks[0].href).toBe("blob:photo");
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:photo");
    clickSpy.mockRestore();
  });
});
