import { $, addPage, NamedPage, UserSelectAutoComplete, AssignSelectAutoComplete, Notification, delay, i18n, url, request, ConfirmDialog, tpl } from '@hydrooj/ui-default'

addPage(new NamedPage(['bulk_message'], () => {
    AssignSelectAutoComplete.getOrConstruct($('[name="recipients"]'), {
        multi: true
    });
}));

addPage (new NamedPage('bulk_message', () => {
  $(document).on('click', '[type="submit"]', async (ev) => {
    ev.preventDefault();

    const $form = $(ev.currentTarget).closest('form');
    try {
      const res = await request.post('', {
        recipients: $form.find('[name="recipients"]').val(),
        content: $form.find('[name="content"]').val(),
      });
      if (res.success) {
        Notification.success(i18n('Success!'));
        await delay(1000);
        window.location.reload();  
      }
    } catch (e) {
      Notification.error(e.message);
    }
  });
}));
