import Link from "next/link";
import type { ServiceContent } from "@vraunix/shared";
import { Icon, serviceIcon } from "@/components/icons";

export function ServiceCard({
  service,
  index,
}: {
  service: ServiceContent;
  index: number;
}) {
  return (
    <Link href={`/services/${service.slug}`} className="service-card">
      <div className="service-card__top">
        <span className="service-card__icon">
          <Icon name={serviceIcon(service.icon)} size={24} />
        </span>
        <span className="service-card__number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div>
        <h3>{service.title}</h3>
        <p>{service.tagline}</p>
      </div>
      <div className="service-card__footer">
        <span>Explore service</span>
        <span className="service-card__arrow">
          <Icon name="arrow-up-right" size={17} />
        </span>
      </div>
    </Link>
  );
}
