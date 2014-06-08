/**
 * Agent Model
 */
'use strict';
define(['jquery','lodash','backbone','marionette','models/base_model'], function ($, _, Backbone, Marionette, BaseModel) {
   return BaseModel.extend({
      urlRoot: '/api/agent'
   });
});