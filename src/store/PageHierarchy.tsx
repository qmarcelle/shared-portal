let pages: string[] = [];

export function setVisiblePageList(pageList: string[]) {
  pages = pageList;
}

export function getVisiblePageList(): string[] {
  return pages;
}
