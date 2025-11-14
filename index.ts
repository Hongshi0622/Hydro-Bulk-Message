import { Context, Handler, MessageModel, UserModel, param, PRIV, Types } from 'hydrooj';  
  
class BulkMessageHandler extends Handler {  
    async get() {  
        this.checkPriv(PRIV.PRIV_SEND_MESSAGE);  
        this.response.template = 'bulk_message.html';  
        this.response.body = {  
            page_name: 'bulk_message',  
        };  
    }  
  
    @param('recipients', Types.CommaSeperatedArray)
    @param('content', Types.Content)
    async post(domainId: string, recipients: string[], content: string) {
        this.checkPriv(PRIV.PRIV_SEND_MESSAGE);

        const uids = new Set<number>();
        const groups = await UserModel.listGroup(domainId);

        for (const recipient of recipients) {
          const trimmed = recipient.trim();
          if (!trimmed) continue;

          const group = groups.find((g) => g.name === trimmed);
          if (group) {
              for (const uid of group.uids) uids.add(uid);
          } else {
              const uid = parseInt(trimmed, 10);
              if (!Number.isNaN(uid)){
                  const udoc = await UserModel.getById(domainId, uid);
                  if (udoc) uids.add(uid);
              }
          }
        }

        if (!uids.size)
            throw new ValidationError('recipients');

        await MessageModel.send(
            this.user._id,
            Array.from(uids),
            content,
            MessageModel.FLAG_UNREAD
        );
        this.back();
        this.response.body = { success: true };
    }
} 
  
export function apply(ctx: Context) {  
    // 注册路由  
    ctx.Route('bulk_message', '/home/messages/bulk', BulkMessageHandler, PRIV.PRIV_SEND_MESSAGE);  
      
    // 在用户下拉菜单中添加入口  
    ctx.injectUI('UserDropdown', 'bulk_message', (h) => ({  
        icon: 'send',  
        displayName: h.translate('bulk_message'),  
    }), PRIV.PRIV_SEND_MESSAGE);  
      
    // 加载英文翻译（默认）  
    ctx.i18n.load('en', {  
        bulk_message: 'Bulk Message',  
        bulk_message_title: 'Send Bulk Messages',  
        bulk_message_uids: 'Target User UIDs',  
        bulk_message_uids_hint: 'Enter user UIDs, separated by commas (e.g., 1,2,3)',  
        bulk_message_content: 'Message Content',  
        bulk_message_send: 'Send',  
    });  
      
    // 加载中文翻译  
    ctx.i18n.load('zh', {  
        bulk_message: '批量消息',  
        bulk_message_title: '批量发送消息',  
        bulk_message_uids: '目标用户UID',  
        bulk_message_uids_hint: '请输入用户UID，多个UID用逗号分隔（例如：1,2,3）',  
        bulk_message_content: '消息内容',  
        bulk_message_send: '发送',  
    });  
}
