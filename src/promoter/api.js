import Vue from 'vue';
import { transformPageHeaders } from './helper';

const service = Vue.prototype.$heshop;

// 获取分销商商品
export function goods(page = 1, keyword = { search: '', sort_key: 'created_time', sort_value: 'ASC' }, size = 10) {
  return new Promise((resolve, reject) => {
    service
      .promotergoods('get', keyword)
      .page(page, size)
      .then(response => {
        transformPageHeaders(response);
        const { data, pagination } = response;
        resolve({
          data: data,
          pagination
        });
      })
      .catch(reject);
  });
}

// 素材列表
export function promotermaterial(page = 1, type = 0, content = '', size = 10) {
  return new Promise((resolve, reject) => {
    service
      .promotermaterial('get', {
        type: type,
        content
      })
      .page(page, size)
      .then(response => {
        transformPageHeaders(response);
        const { data, pagination } = response;
        resolve({
          data: data,
          pagination
        });
      })
      .catch(reject);
  });
}

// 分享素材
export function promotermaterialShare(id) {
  return new Promise((resolve, reject) => {
    service
      .promotermaterial(
        'post',
        {
          id
        },
        {}
      )
      .then(resolve)
      .catch(reject);
  });
}

// 获取招募令
export function recruit() {
  return new Promise((resolve, reject) => {
    service
      .search(
        'post',
        {
          include: 'setting'
        },
        {
          keyword: 'promoter_recruit_make'
        }
      )
      .then(response => {
        resolve(response.content);
      })
      .catch(reject);
  });
}

// 是否启用分销协议
export function useAgreement() {
  return new Promise((resolve, reject) => {
    service
      .search(
        'post',
        {
          include: 'setting'
        },
        {
          keyword: 'promoter_setting',
          content_key: 'use_agreement'
        }
      )
      .then(resolve)
      .catch(reject);
  });
}

// 获取分销协议
export function agreement() {
  return new Promise((resolve, reject) => {
    service
      .search(
        'post',
        {
          include: 'setting'
        },
        {
          keyword: 'promoter_setting'
        }
      )
      .then(response => {
        const { agreement_content, agreement_title } = response.content;
        resolve({
          agreement_content: agreement_content,
          agreement_title: agreement_title
        });
      })
      .catch(reject);
  });
}

// 接令牌
export function receiveRecruitToken(invite_id) {
  return new Promise((resolve, reject) => {
    service
      .promoter('get', {
        behavior: 'recruiting',
        invite_id
      })
      .then(resolve)
      .catch(reject);
  });
}

// 申请检测
export function applyMonitoring() {
  return new Promise((resolve, reject) => {
    service
      .promoter('get', {
        behavior: 'apply_check'
      })
      .then(resolve)
      .catch(reject);
  });
}

// 申请成为分销商
export function applyPromoter(applyContent = []) {
  return new Promise((resolve, reject) => {
    service
      .promoter('post', {
        apply_content: applyContent
      })
      .then(resolve)
      .catch(reject);
  });
}

// 分销商中心
export function personalCenter() {
  return new Promise((resolve, reject) => {
    service.promoter('get').then(resolve).catch(reject);
  });
}

// 获取申请结果
export function applyAudit() {
  return new Promise((resolve, reject) => {
    service
      .promoter('get', {
        behavior: 'apply_audit'
      })
      .then(resolve)
      .catch(reject);
  });
}

// 空间动态列表
export function promoterzone(page = 1, UID) {
  return new Promise((resolve, reject) => {
    service
      .promoterzone('get', {
        UID: UID
      })
      .page(page, 10)
      .then(response => {
        transformPageHeaders(response);
        const { data, pagination } = response;
        resolve({
          data: data,
          pagination
        });
      })
      .catch(reject);
  });
}

// 动态点赞
export function dynamicLike(zone_id) {
  return new Promise((resolve, reject) => {
    service
      .promoterzone(
        'post',
        {
          behavior: 'vote'
        },
        {
          zone_id: zone_id
        }
      )
      .then(resolve)
      .then(reject);
  });
}

// 删除动态
export function dynamicDel(zone_id) {
  return new Promise((resolve, reject) => {
    service.promoterzone('delete', zone_id).then(resolve).then(reject);
  });
}

// 发布动态
export function publishDynamic(body = {}) {
  return new Promise((resolve, reject) => {
    service.promoterzone('post', body).then(resolve).catch(reject);
  });
}

// 动态详情
export function dynamicDetail(id) {
  id = parseInt(id);
  return new Promise((resolve, reject) => {
    service.promoterzone('get', id).then(resolve).catch(reject);
  });
}

// 编辑动态详情
export function dynamicEdit(id, body) {
  id = parseInt(id);
  return new Promise((resolve, reject) => {
    service.promoterzone('put', id, body).then(resolve).catch(reject);
  });
}

// 搜索普通商品
export function searchGoods(page = 1, keyword = {}) {
  return new Promise((resolve, reject) => {
    service
      .search(
        'post',
        {
          include: 'goods'
        },
        {
          keyword: keyword
        }
      )
      .page(page, 10)
      .then(response => {
        transformPageHeaders(response);
        const { data, pagination } = response;
        resolve({
          data: data,
          pagination
        });
      })
      .catch(reject);
  });
}

// 分销等级
export function promoterlevel() {
  return new Promise((resolve, reject) => {
    service.promoterlevel('get').then(resolve).catch(reject);
  });
}

// 分销订单
export function promoterorderList(page = 1, { time_type = 'all', time_start = '', time_end = '' }) {
  return new Promise((resolve, reject) => {
    service
      .promoterorder('get', {
        time_type,
        time_start,
        time_end
      })
      .page(page, 10)
      .then(response => {
        transformPageHeaders(response);
        const { data, pagination } = response;
        resolve({
          data: data,
          pagination
        });
      })
      .catch(reject);
  });
}

// 分销订单统计
export function promoterOrderCount({ time_type = 'all', time_start = '', time_end = '' }) {
  return new Promise((resolve, reject) => {
    service
      .promoterorder('get', {
        time_type,
        time_start,
        time_end,
        behavior: 'count'
      })
      .then(resolve)
      .catch(reject);
  });
}

// 分销商下线列表
export function promoterChildList(page, parent) {
  return new Promise((resolve, reject) => {
    service
      .promoter(
        'post',
        {
          behavior: 'search'
        },
        {
          parent: parent
        }
      )
      .page(page, 10)
      .then(response => {
        transformPageHeaders(response);
        const { data, pagination } = response;
        resolve({
          data: data,
          pagination
        });
      })
      .catch(reject);
  });
}

//  分销商下线列表切换栏
export function promoterChildCount() {
  return new Promise((resolve, reject) => {
    service
      .promoter(
        'post',
        {
          behavior: 'tab'
        },
        {}
      )
      .then(resolve)
      .catch(reject);
  });
}

// 排行榜
// ranking_dimension total_money:累计销售额 total_bonus:累计佣金 all_children:当前下线
// ranking_time 1 今日 2 昨日  3 本月  默认汇总  ranking_dimension = all_children时不用传
export function rankList({ ranking_dimension = '', ranking_time = 1 }) {
  return new Promise((resolve, reject) => {
    service
      .rank('get', {
        ranking_dimension,
        ranking_time
      })
      .then(response => {
        resolve(response);
      })
      .catch(reject);
  });
}

// 申请提现
export function finance({ price = '', type = null, extra = {} }) {
  return new Promise((resolve, reject) => {
    service
      .finance(
        'post',
        { model: 'promoter' },
        {
          price,
          type,
          extra
        }
      )
      .then(resolve)
      .catch(reject);
  });
}

// 提现列表
export function financeList(page, { model = 'promoter', status = null, first_day = null }) {
  let data = {
    model: model,
    status: status
  };
  if (first_day) {
    data.first_day = first_day;
  }
  return new Promise((resolve, reject) => {
    service.finance('get', data).then(resolve).catch(reject);
  });
}

// 其他用户简单详情
export function userDetail(UID) {
  return new Promise((resolve, reject) => {
    service
      .users('get', {
        behavior: 'simple_info',
        UID
      })
      .then(resolve)
      .catch(reject);
  });
}
