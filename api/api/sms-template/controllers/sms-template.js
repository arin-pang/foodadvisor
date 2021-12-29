'use strict';
const { sanitizeEntity } = require('strapi-utils');

const cleanupEntity = (entity) => {
  const { content } = entity;

  return { ...entity, content: { html: content.html, css: content.css } };
};

module.exports = {
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.sms_templates.search(ctx.query); /* eslint-disable-line no-undef */
    } else {
      entities = await strapi.services.sms_templates.find(ctx.query); /* eslint-disable-line no-undef */
    }

    return entities.map((entity) => {
      return sanitizeEntity(cleanupEntity(entity), { model: strapi.models.sms_templates } /* eslint-disable-line no-undef */);
    });
  },
  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.sms_templates.findOne({ id }); /* eslint-disable-line no-undef */

    return sanitizeEntity(cleanupEntity(entity), { model: strapi.models.sms_templates } /* eslint-disable-line no-undef */);
  },
};