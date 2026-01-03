document.getElementById("download").addEventListener("click", () => {
  const textarea = document.getElementById("input");
  const rawText = textarea.value;

  if (!rawText.trim()) {
    alert("Please paste some data from your spreadsheet.");
    return;
  }

  const csv = "\uFEFF" + spreadsheetPasteToCsv(rawText);

  const filenameInput = document.getElementById("filename");
  let filename = filenameInput.value.trim() || "foreign-properties";
  filename = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, "");

  if (!filename.toLowerCase().endsWith(".csv")) {
    filename += ".csv";
  }

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  alert(`Your file "${filename}" has started downloading.\n\nCheck your downloads folder.`);

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

function spreadsheetPasteToCsv(text) {
  return text
    .trimEnd()
    .split(/\r?\n/)
    .map((row) =>
      row
        .split("\t")
        .map((cell) => {
          const cleaned = cell.trim();
          return `"${cleaned.replace(/"/g, '""')}"`;
        })
        .join(",")
    )
    .join("\n");
}
