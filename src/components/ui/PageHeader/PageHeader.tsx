import React from "react";
import Link from "next/link";
import styles from "./PageHeader.module.scss";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs }) => {
  // If there's only one breadcrumb (usually Home), it's redundant to show it next to the title.
  const showBreadcrumbs = breadcrumbs.length > 1;

  return (
    <div className={styles.header_container}>
      <h1 className={styles.title}>{title}</h1>

      {showBreadcrumbs && (
        <ul className={styles.breadcrumbs}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li key={index}>
                {crumb.href && !isLast ? (
                  <Link href={crumb.href} className={styles.crumb_link}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={styles.crumb_current}>{crumb.label}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PageHeader;
