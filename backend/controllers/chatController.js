import { runChatPipeline } from '../services/chatService.js';

export async function postChat(req, res, next) {
  try {
    const payload = await runChatPipeline(req.body, req.log);
    res.json(payload);
  } catch (e) {
    next(e);
  }
}
