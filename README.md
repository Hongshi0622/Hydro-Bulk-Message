# Hydro-Bulk-Message
这是为`Hydro`老师们书写的`批量消息`功能。  
本功能默认为拥有`PRIV.PRIV_SEND_MESSAGE`权限的用户开放，可以在`index.ts`中第`40`行左右处修改。  

## 1 下载文件
如果你会使用`Git`你可以直接克隆这个仓库。  
或者你可以直接下载`hydro-bulk-message.zip`解压并添加到你的插件列表中即可使用。

## 2 添加插件
我们一般建议将文件夹解压后放在`/root/.hydro/addons`目录中。  
你应当创建一个名为`hydro-bulk-message`的文件夹在当前目录中，再将`hydro-bulk-message.zip`放入并解压到当前文件夹。  
请检查文件夹结构是否正确，正确的结构为：
```
hydro-bulk-message/
├── package.json
├── index.ts
└── templates/
    └── bulk_message.html
```
使用`hydrooj addon add /root/.hydro/addons/hydro-bulk-message`后`pm2 restart hydrooj`来添加插件。  

## 3 使用
拥有对应权限的用户可以在头像下方下拉菜单中找到`批量消息`按钮。  
点击进入页面，你需要输入目标用户UID，使用**英文逗号**分割。  
下方消息支持纯文本多行消息，富文本消息由于莫名其妙的原因不能完全兼容。

**本插件由`Qwen3_Coder`辅助开发，即有部分代码为AIGC**
