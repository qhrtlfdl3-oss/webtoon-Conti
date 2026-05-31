function PageTabs({
  pages,
  activePageId,
  setActivePageId,
  setSelected,
  addPage,
  deletePage,
}) {
  return (
    <div className="page-tabs">
      {pages.map((page) => (
        <button
          key={page.id}
          className={`page-tab ${page.id === activePageId ? "active" : ""}`}
          onClick={() => {
            setActivePageId(page.id);
            setSelected(null);
          }}
        >
          <span>{page.title}</span>

          <span
            className="tab-close"
            onClick={(e) => {
              e.stopPropagation();
              deletePage(page.id);
            }}
          >
            ×
          </span>
        </button>
      ))}

      <button className="page-tab add-tab" onClick={addPage}>
        +
      </button>
    </div>
  );
}

export default PageTabs;