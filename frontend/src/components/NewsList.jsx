function NewsList({ items }) {
  return (
    <aside className="news">
      <h2 className="news__heading">새소식</h2>
      <ul className="news__list">
        {items.map((item) => (
          <li key={item.id} className="news__item">
            <span className="news__tag">{item.tag}</span>
            <p className="news__title">{item.title}</p>
            <span className="news__date">{item.date}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default NewsList;
