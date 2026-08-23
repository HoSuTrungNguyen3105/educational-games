const DEFAULT_PAGINATION = {
  current_page: 1,
  per_page: 100,
  total: 0,
  total_pages: 1,
  keyword: "",
  sort_by: "",
  sort_dir: "DESC",
  from_date: "",
  to_date: "",
  date_col: "created_at",
};

export function sendSuccess(res, data, msg = "success", pagination = null) {
  const body = { status: true, code: 200, msg, data };
  if (pagination) body.pagination = pagination;
  return res.json(body);
}

export function sendCreated(res, data, msg = "created") {
  return res.status(201).json({ status: true, code: 201, msg, data });
}

export function sendNoContent(res) {
  return res.status(204).end();
}

export function sendError(res, msg = "error", code = 400) {
  return res.status(code).json({ status: false, code, msg, data: null });
}

export function buildPagination({ page, perPage, total, keyword, sortBy, sortDir, fromDate, toDate, dateCol } = {}) {
  const p = { ...DEFAULT_PAGINATION };
  if (page != null) p.current_page = Number(page) || 1;
  if (perPage != null) p.per_page = Number(perPage) || 100;
  p.total = Number(total) || 0;
  p.total_pages = Math.ceil(p.total / p.per_page) || 1;
  if (keyword != null) p.keyword = keyword;
  if (sortBy != null) p.sort_by = sortBy;
  if (sortDir != null) p.sort_dir = sortDir.toUpperCase() === "ASC" ? "ASC" : "DESC";
  if (fromDate != null) p.from_date = fromDate;
  if (toDate != null) p.to_date = toDate;
  if (dateCol != null) p.date_col = dateCol;
  return p;
}
