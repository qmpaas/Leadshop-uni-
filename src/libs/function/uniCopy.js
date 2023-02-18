function uniCopy({ content, success, error }) {
  if (!content) return error('the content can not be blank');
  content = typeof content === 'string' ? content : content.toString();
  // #ifndef H5
  uni.setClipboardData({
    data: content,
    success: function () {
      success && success('Copy successfully');
      uni.showToast({
        title: '内容已复制',
        icon: 'none'
      });
    },
    fail: function () {
      error && error('Copy failed');
    }
  });
  // #endif

  // #ifdef H5
  if (!document.queryCommandSupported('copy')) {
    error && error('Browser does not support');
  }
  let textarea = document.createElement('textarea');
  textarea.value = content;
  textarea.readOnly = 'readOnly';
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, content.length);
  let result = document.execCommand('copy');
  if (result) {
    uni.showToast({
      title: '内容已复制',
      icon: 'none'
    });
    success && success('Copy successfully');
  } else {
    error && error('Copy failed');
  }
  textarea.remove();
  // #endif
}

export default uniCopy;
