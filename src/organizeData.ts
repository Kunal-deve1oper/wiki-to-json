type wikiData = {
  heading: string;
  text: string;
};

export const fixData = (parsedData: Array<wikiData>): Array<wikiData> => {
  const updatedData: Array<wikiData> = [];

  parsedData.map((e) => {
    if (Object.keys(e).length > 0) {
      let ind = updatedData.findIndex(
        (element) => element.heading === e.heading.replace(/\[[^\]]*\]/g, "")
      );
      if (ind == -1) {
        updatedData.push({
          heading: e.heading.replace(/\[[^\]]*\]/g, ""),
          text: e.text.replace(/\n\s*/g, " ").replace(/\[[^\]]*\]/g, ""),
        });
      } else {
        updatedData[ind].text =
          updatedData[ind].text +
          e.text.replace(/\n\s*/g, " ").replace(/\[[^\]]*\]/g, "");
      }
    }
  });
  return updatedData;
};
