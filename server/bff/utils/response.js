export function sendSuccess(res, data, msg = "success", status = 200) {
  res.status(status).json({ status: true, code: status, msg, data });
}

export function sendCreated(res, data, msg = "created", status = 201) {
  res.status(status).json({ status: true, code: status, msg, data });
}

export function sendError(res, msg, status = 400) {
  res.status(status).json({ status: false, code: status, msg });
}