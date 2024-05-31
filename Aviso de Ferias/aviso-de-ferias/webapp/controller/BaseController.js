sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("br.com.embraer.avisodeferias.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		getLoggedUser: function () {
			return '101219'
			
			var sStatusFioriLauchPadRuntime = sap.ushell || false;	
			
			if (sStatusFioriLauchPadRuntime){
				return sap.ushell.Container.getService("UserInfo").getId();
			}
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		},

		getRoleFunction: function ({
			groupId,
			user,
			operator
		}) {
			const oModel = this.getOwnerComponent().getModel('CPI_RBP')
			const sPath = "/SobreavisoRBP"

			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter({
				path: "groupId",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: groupId
			}));
			aFilters.push(new sap.ui.model.Filter({
				path: "user",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: user
			}));
			aFilters.push(new sap.ui.model.Filter({
				path: "oper",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: operator
			}));
			return new Promise(function (fnResolve, fnReject) {
				oModel.read(sPath, {
					filters: aFilters,
					success: function (oResult) {
						if (oResult.results[0]) {
							fnResolve(oResult.results[0].result)
						} else {
							fnResolve("false")
						}
					},
					error: function (oError) {
						fnReject("false")
					}
				})
			})
		},

		checkAuthorization: async function () {
			const OPERATOR_READ_ROLE = 'D'
			var userId = this.getLoggedUser()
			var bHasAuthorization = "false"
			var bCanEdit = false
			var sRoleGroupId

			var oRoleGroupId = {
				cust_manager: "3427L",
				cust_manager_v: "3428L",
				cust_admin: "3429L",
				cust_admin_v: "3430L",
				cust_admin_bra: "3431L",
				cust_admin_bra_v: "3432L",
				cust_board: "3433L",
				cust_board_v: "3434L",
				cust_board_bra: "3435L",
				cust_board_bra_v: "3436L"
			};

			for (var i = 0; i < 10; i++) {
				switch (i) {
				case 0:
					sRoleGroupId = oRoleGroupId.cust_manager;
					break;
				case 1:
					sRoleGroupId = oRoleGroupId.cust_manager_v;
					break;
				case 2:
					sRoleGroupId = oRoleGroupId.cust_admin;
					break;
				case 3:
					sRoleGroupId = oRoleGroupId.cust_admin_v;
					break;
				case 4:
					sRoleGroupId = oRoleGroupId.cust_admin_bra;
					break;
				case 5:
					sRoleGroupId = oRoleGroupId.cust_admin_bra_v;
					break;
				case 6:
					sRoleGroupId = oRoleGroupId.cust_board;
					break;
				case 7:
					sRoleGroupId = oRoleGroupId.cust_board_v;
					break;
				case 8:
					sRoleGroupId = oRoleGroupId.cust_board_bra;
					break;
				case 9:
					sRoleGroupId = oRoleGroupId.cust_board_bra_v;
					break;
				}

				await this.getRoleFunction({
					groupId: sRoleGroupId,
					user: userId,
					operator: OPERATOR_READ_ROLE
				}).then(function (oResult) {
						bHasAuthorization = oResult
					},
					function (oResult) {
						bHasAuthorization = oResult
					})

				if (bHasAuthorization == "true") {
					break;
				}
			}

			if (bHasAuthorization == "false") {
				this.getRouter().getTargets().display("objectNotFound");
			}

		}		

	});

});