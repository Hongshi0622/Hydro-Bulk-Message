import { Context, Handler, MessageModel, param, PRIV, Types } from 'hydrooj';  
  
class BulkMessageHandler extends Handler {  
    async get() {  
        this.checkPriv(PRIV.PRIV_SEND_MESSAGE);  
        this.response.template = 'bulk_message.html';  
        this.response.body = {  
            page_name: 'bulk_message',  
        };  
    }  
  
    @param('uids', Types.CommaSeperatedArray)  
    @param('content', Types.Content)  
    async post(domainId: string, uids: string[], content: string) {  
        this.checkPriv(PRIV.PRIV_SEND_MESSAGE);  
          
        // uids 已经是字符串数组，直接转换为数字数组  
        const uidArray = uids  
            .map(uid => parseInt(uid.trim(), 10))  
            .filter(uid => !Number.isNaN(uid));  
          
        if (uidArray.length === 0) {  
            throw new Error('Please enter valid user UIDs');  
        }  
          
        // 使用MessageModel批量发送消息  
        await MessageModel.send(  
            this.user._id,  
            uidArray,  
            content,  
            MessageModel.FLAG_UNREAD  
        );  
          
        this.back();  
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