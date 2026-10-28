import { Icon } from "@/components/icons";

export function FaqList({
  faqs,
  groupByCategory = false,
}: {
  faqs: { question: string; answer: string; category?: string }[];
  groupByCategory?: boolean;
}) {
  const categories = groupByCategory
    ? [...new Set(faqs.map((faq) => faq.category ?? "General"))]
    : [null];

  return (
    <div className="faq-list">
      {categories.map((category) => {
        const items = category
          ? faqs.filter((faq) => (faq.category ?? "General") === category)
          : faqs;
        const categoryId = category
          ? category.toLowerCase().replace(/\s+/g, "-")
          : undefined;
        return (
          <div
            key={category ?? "all"}
            className="faq-list__group"
            id={categoryId}
          >
            {category && <h2 className="faq-list__category">{category}</h2>}
            {items.map((faq) => (
              <details className="faq-item" key={faq.question}>
                <summary>
                  <span>{faq.question}</span>
                  <span className="faq-item__icon">
                    <Icon name="plus" size={18} />
                  </span>
                </summary>
                <div className="faq-item__answer">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        );
      })}
    </div>
  );
}
