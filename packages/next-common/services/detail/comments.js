import nextApi from "next-common/services/nextApi";

export async function fetchDetailComments(url, context) {
  const { page, page_size: pageSize } = context.query;
  const { result: comments } = await nextApi.fetch(url, {
    page: page ?? "last",
    pageSize: Math.min(pageSize ?? 50, 100),
  });

  return comments;
}
