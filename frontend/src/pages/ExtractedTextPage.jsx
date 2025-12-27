export default function ExtractedTextPage() {
  const data = JSON.parse(localStorage.getItem("result") || "{}");

  return (
    <div>
      <h2>Result</h2>
      <pre>{data.text}</pre>
      {data.download && <a href={data.download}>Download Word</a>}
    </div>
  );
}
