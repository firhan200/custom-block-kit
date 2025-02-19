import type { BaseSchema } from "../../base/base";
import { dateOptions } from "../date-calc/date-options";
import timezones from "./timezones.json";

export class SetVariable {
  schema: BaseSchema = {
    key: "SET_VARIABLE",
    name: "Set Var",
    color: "#EAAB46",
    blockType: "functional",
    toggleName: "feature.cbk.setvariable",
    icon: "M10 2H2C1.445 2 1 2.45 1 3V9C1 9.55 1.445 10 2 10H10C10.55 10 11 9.55 11 9V3C11 2.45 10.555 2 10 2ZM10 9H2V4H10V9ZM9 8.5H6V7.5H9V8.5ZM3.75 8.5 3.045 7.795 4.335 6.5 3.04 5.205 3.75 4.5 5.75 6.5 3.75 8.5Z",
    stencil: {
      group: "FUNCTIONS",
      fontSize: 12,
    },
    editor: {
      elements: [
        {
          ref: "block_description",
          component: "BlockDescription",
          componentProps: {
            label: "Block Description",
            placeholder: "Enter a description for this block",
          },
        },
        {
          ref: "fn_selector",
          component: "SelectInput",
          componentProps: {
            label: "Select Function",
            placeholder: "Select function",
            options: [
              { label: "Create new variable", value: "create" },
              {
                label: "Update existing variable",
                value: "update",
              },
              { label: "Format existing LIST variable", value: "format" },
              { label: "Format existing DATE variable", value: "formatDate" },
            ],
          },
        },
        {
          ref: "setvar_create_group",
          component: "Group",
          componentProps: {
            label: "Create new variable",
          },
          showIf: 'fn_selector == "create"',
          children: [
            {
              ref: "variableType",
              component: "SelectInput",
              componentProps: {
                label: "Variable Type",
                placeholder: "Select variable type",
                options: [
                  { label: "Text", value: "TXT" },
                  { label: "Number", value: "NUM" },
                  { label: "Datetime", value: "DATE" },
                  { label: "File", value: "FILE" },
                  { label: "Doc", value: "DOC" },
                  { label: "Checkbox", value: "CBX" },
                  { label: "Radio", value: "RAD" },
                ],
              },
            },
            {
              ref: "variableName",
              component: "TextInput",
              componentProps: {
                label: "Set name of variable as",
                placeholder: "Enter variable name",
                format: "clientTimezone",
                optionsRef: "radioOptions",
              },
              validators: [
                {
                  method: "isVariableUnique",
                  message: "Variable name already exists",
                },
                {
                  method: "matches",
                  value: "^\\S*$",
                  message: "Variable name cannot contain spaces",
                },
                {
                  method: "matches",
                  value: "^[a-zA-Z]",
                  message: "Variable name must start with an alphabet",
                },
                {
                  method: "matches",
                  value: "^[a-zA-Z0-9_]+$",
                  message:
                    "Variable name is alphanumeric characters and _ only",
                },
                {
                  method: "max",
                  value: "50",
                  message: "This must be less than 50 characters",
                },
              ],
              output: {
                ref: "variableType",
              },
            },
            {
              ref: "variableValue",
              component: "TextInput",
              showIf: 'variableType == "TXT"',
              componentProps: {
                label: "Variable Value",
                placeholder: "Enter variable value",
              },
            },
            {
              ref: "numVariableValue",
              component: "NumberInput",
              showIf: 'variableType == "NUM"',
              componentProps: {
                label: "Variable Value",
                placeholder: "Enter variable value",
              },
            },
            {
              ref: "datetimeSelection",
              component: "SelectInput",
              showIf: 'variableType == "DATE"',
              componentProps: {
                label: "Select date option",
                placeholder: "Select date option",
                options: [
                  {
                    label: "Current Date",
                    value: "currentDate",
                  },
                  {
                    label: "Custom Date",
                    value: "customDate",
                  },
                ],
              },
            },
            {
              ref: "datetimeVariableValue",
              component: "DateTimeInput",
              showIf:
                'datetimeSelection == "customDate" && variableType == "DATE"',
              componentProps: {
                label: "Variable Value",
                placeholder: "Enter variable value",
              },
            },
            {
              ref: "fileVariableValue",
              component: "FileInput",
              showIf: 'variableType == "FILE"',
              componentProps: {
                label: "Variable Value",
                placeholder: "Enter variable value",
              },
            },
            {
              ref: "setvar_doc_var_group",
              component: "Group",
              componentProps: {
                label: "Select document template to use",
              },
              showIf: 'variableType == "DOC"',
              children: [
                {
                  ref: "docTemplateType",
                  component: "RadioGroupInput",
                  componentProps: {
                    options: [
                      {
                        label: "New template",
                        value: "new_template",
                        defaultChecked: true,
                      },
                      {
                        label: "Existing document variable",
                        value: "existing_document_variable",
                      },
                    ],
                    whenChanged: (cbk) => {
                      cbk.setElementValue("docVariableValue", "");
                      cbk.setElementValue("existingDocVariableValue", "");
                    },
                  },
                },
                {
                  ref: "docVariableValue",
                  component: "DocInput",
                  showIf: 'docTemplateType == "new_template"',
                  componentProps: {
                    label: "Document Value",
                    placeholder: "Enter document value",
                  },
                },
                {
                  ref: "existingDocVariableValue",
                  component: "SelectInput",
                  showIf: 'docTemplateType == "existing_document_variable"',
                  componentProps: {
                    label: "Select doc variable",
                    options: "getOnlyDocVariables",
                  },
                },
              ],
            },
            {
              ref: "checkboxVariableValue",
              component: "SelectInput",
              showIf: 'variableType == "CBX"',
              componentProps: {
                label: "Variable Value",
                placeholder: "Select variable value",
                options: [
                  {
                    label: "Checked",
                    value: "TRUE",
                  },
                  {
                    label: "Unchecked",
                    value: "FALSE",
                  },
                ],
              },
            },
            {
              ref: "radio_variable_group",
              component: "Group",
              showIf: 'variableType == "RAD"',
              componentProps: {
                label: "Add Radio Options",
              },
              children: [
                {
                  ref: "radioVariableValue",
                  component: "SelectInput",
                  showIf: "!!radioOptions",
                  componentProps: {
                    label: "Select radio option",
                    options: async (cbk) => {
                      let options: { label: string; value: string }[] = [];
                      const radioOptions = cbk.getElementValue(
                        "radioOptions"
                      ) as Record<string, string>[];

                      if (radioOptions instanceof Array) {
                        options = radioOptions
                          .filter((x) => x?.option)
                          .map((x) => ({
                            label: x.option || "",
                            value: x.option || "",
                          }));
                      }

                      return options;
                    },
                  },
                },
                {
                  ref: "radioOptions",
                  component: "ListInput",
                  componentProps: {
                    label: "Add options to radio input",
                    addLabel: "Add Option",
                    inputComponent: {
                      ref: "option",
                      component: "TextInput",
                      componentProps: {
                        placeholder: "--None--",
                        includeEmptyErrorPlaceholder: false,
                      },
                    },
                    whenChanged: (cbk, value) => {
                      const radioVariableValue =
                        cbk.getElementValue("radioVariableValue");

                      if (value === radioVariableValue) {
                        cbk.setElementValue("radioVariableValue", "");
                      }
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          ref: "setvar_update_group",
          component: "Group",
          componentProps: {
            label: "Update existing variable",
          },
          showIf: 'fn_selector == "update"',
          children: [
            {
              ref: "update_variable_name",
              component: "SelectInput",
              componentProps: {
                label: "Variable Name",
                placeholder: "Select variable name",
                options: "getExistingVariables",
              },
            },
            {
              ref: "update_value",
              component: "TextInput",
              showIf:
                '(GET(VARS,update_variable_name)).fieldInputType == "TXT"',
              componentProps: {
                label: "Variable Value",
                placeholder: "Enter variable value",
              },
            },
            {
              ref: "update_num",
              component: "NumberInput",
              showIf:
                '(GET(VARS,update_variable_name)).fieldInputType == "NUM"',
              componentProps: {
                label: "Variable Value",
                placeholder: "Enter variable value",
              },
            },
            {
              ref: "update_date",
              component: "DateTimeInput",
              showIf:
                '(GET(VARS,update_variable_name)).fieldInputType == "DATE"',
              componentProps: {
                label: "Variable Value",
                placeholder: "Enter variable value",
              },
            },
            {
              ref: "update_file",
              component: "FileInput",
              showIf:
                '(GET(VARS,update_variable_name)).fieldInputType == "FILE"',
              componentProps: {
                label: "Variable Value",
                placeholder: "Enter variable value",
              },
            },
            {
              ref: "update_doc_var_group",
              component: "Group",
              componentProps: {
                label: "Select document template to use",
              },
              showIf:
                '(GET(VARS,update_variable_name)).fieldInputType == "DOC"',
              children: [
                {
                  ref: "updateDocTemplateType",
                  component: "RadioGroupInput",
                  componentProps: {
                    options: [
                      {
                        label: "New template",
                        value: "new_template",
                        defaultChecked: true,
                      },
                      {
                        label: "Existing document variable",
                        value: "existing_document_variable",
                      },
                    ],
                    whenChanged: (cbk) => {
                      cbk.setElementValue("update_doc", "");
                      cbk.setElementValue("existing_update_doc", "");
                    },
                  },
                },
                {
                  ref: "update_doc",
                  component: "DocInput",
                  showIf: 'updateDocTemplateType == "new_template"',
                  componentProps: {
                    label: "Document Value",
                    placeholder: "Enter document value",
                  },
                },
                {
                  ref: "existing_update_doc",
                  component: "SelectInput",
                  showIf:
                    'updateDocTemplateType == "existing_document_variable"',
                  componentProps: {
                    label: "Select doc variable",
                    options: "getOnlyDocVariables",
                  },
                },
              ],
            },
            {
              ref: "update_checkbox",
              component: "SelectInput",
              showIf:
                '(GET(VARS,update_variable_name)).fieldInputType == "CBX"',
              componentProps: {
                label: "Checkbox Value",
                placeholder: "Enter variable value",
                options: [
                  {
                    label: "Checked",
                    value: "TRUE",
                  },
                  {
                    label: "Unchecked",
                    value: "FALSE",
                  },
                ],
              },
            },
            {
              ref: "update_radio",
              component: "SelectInput",
              showIf:
                '(GET(VARS,update_variable_name)).fieldInputType == "RAD"',
              componentProps: {
                label: "Radio Option Value",
                placeholder: "Select Radio Option",
                options: async (cbk) => {
                  const selectedVariable = cbk.getElementValue(
                    "update_variable_name"
                  ) as string;

                  const radioOptions = cbk.getRadioOptions(selectedVariable);

                  return radioOptions.map((x) => ({
                    label: x,
                    value: x,
                  }));
                },
              },
            },
          ],
        },
        {
          ref: "setvar_format_list_group",
          component: "Group",
          componentProps: {
            label: "Format existing LIST variable",
          },
          showIf: 'fn_selector == "format"',
          children: [
            {
              ref: "selected_variable_name",
              component: "SelectInput",
              componentProps: {
                label: "Selected Variable Name",
                placeholder: "Select variable name",
                options: "getFormattableListVariables",
              },
            },
            {
              ref: "override_variable",
              component: "SelectInput",
              componentProps: {
                label: "Override Variable Value",
                placeholder: "To override the list variable or not",
                options: [
                  { label: "Yes", value: "true" },
                  { label: "No", value: "false" },
                ],
              },
            },
            {
              ref: "new_variable_name",
              component: "TextInput",
              showIf: "override_variable == 'false'",
              componentProps: {
                label: "New Formatted Variable Name",
                placeholder: "Enter variable name",
              },
              validators: [
                {
                  method: "isVariableUnique",
                  message: "Variable name already exists",
                },
                {
                  method: "matches",
                  value: "^\\S*$",
                  message: "Variable name cannot contain spaces",
                },
                {
                  method: "matches",
                  value: "^[a-zA-Z]",
                  message: "Variable name must start with an alphabet",
                },
                {
                  method: "matches",
                  value: "^[a-zA-Z0-9_]+$",
                  message:
                    "Variable name is alphanumeric characters and _ only",
                },
                {
                  method: "max",
                  value: "50",
                  message: "This must be less than 50 characters",
                },
              ],
              output: {
                as: "LIST",
              },
            },
            {
              ref: "ending_suffix",
              component: "TextInput",
              componentProps: {
                label: "Suffix to append to end of each list item",
                placeholder: "Common suffix",
              },
            },
            {
              ref: "second_last_suffix",
              component: "TextInput",
              componentProps: {
                label:
                  "Suffix to append to the end of the second last list item",
                placeholder: "Second last suffix",
              },
            },
            {
              ref: "last_suffix",
              component: "TextInput",
              componentProps: {
                label: "Suffix to append to the end of the last list item",
                placeholder: "Last Suffix",
              },
            },
            {
              ref: "concatenated_variable",
              component: "TextInput",
              componentProps: {
                label: "Concatenated Variable Name",
                placeholder:
                  "Enter variable name, converts ['a','b'] to 'a, b'",
              },
              validators: [
                {
                  method: "isVariableUnique",
                  message: "Variable name already exists",
                },
                {
                  method: "matches",
                  value: "^\\S*$",
                  message: "Variable name cannot contain spaces",
                },
                {
                  method: "max",
                  value: "50",
                  message: "This must be less than 50 characters",
                },
              ],
              output: {
                as: "TXT",
              },
            },
          ],
        },
        {
          ref: "setvar_format_date_group",
          component: "Group",
          componentProps: {
            label: "Format existing DATE variable",
          },
          showIf: 'fn_selector == "formatDate"',
          children: [
            {
              ref: "selected_date_variable_name",
              component: "SelectInput",
              componentProps: {
                label: "Selected Variable Name",
                placeholder: "Select variable name",
                options: "getDateVariables",
              },
            },
            {
              ref: "timezones",
              component: "SelectInput",
              componentProps: {
                label: "Timezone",
                placeholder: "Select timezone",
                options: timezones.map((x) => ({
                  label: x.text,
                  value: x.value,
                })),
                isSearchable: true,
              },
            },
            {
              ref: "format_date",
              component: "SelectInput",
              componentProps: {
                label: "Format Date as",
                placeholder: "YYYY/MM/DD",
                options: dateOptions,
              },
            },
            {
              ref: "format_date_variable_name",
              component: "TextInput",
              componentProps: {
                label: "Set name of variable as",
                placeholder: "Enter Variable Name",
                format: "format_date",
                timezone: "timezones",
              },
              validators: [
                {
                  method: "isVariableUnique",
                  message: "This variable already exists!",
                },
                {
                  method: "required",
                  message: "Please insert a variable name",
                },
                {
                  method: "matches",
                  value: "^\\S*$",
                  message: "Variable name cannot contain spaces",
                },
                {
                  method: "matches",
                  value: "^[a-zA-Z]",
                  message: "Variable name must start with an alphabet",
                },
                {
                  method: "matches",
                  value: "^[a-zA-Z0-9_]+$",
                  message:
                    "Variable name is alphanumeric characters and _ only",
                },
                {
                  method: "max",
                  value: "50",
                  message: "This must be less than 50 characters",
                },
              ],
              output: {
                as: "DATE",
              },
            },
          ],
        },
      ],
    },
    runtime: async (cbk) => {
      const { moment } = cbk.library;
      const fnTypes = {
        create: "create",
        update: "update",
        format: "format",
        formatDate: "formatDate",
      };
      const fn = cbk.getElementValue("fn_selector") as keyof typeof fnTypes;
      cbk.log("FUNCTION TYPE", fn);

      switch (fnTypes[fn]) {
        case "create":
          const createVariable = cbk.getElementValue("variableName");
          const variableType = cbk.getElementValue("variableType");
          const datetimeSelection = cbk.getElementValue("datetimeSelection");
          let value = "";

          if (variableType === "DATE") {
            const curTime =
              datetimeSelection === "currentDate"
                ? moment().format()
                : cbk.getElementValue("datetimeVariableValue");
            const utc = moment(curTime).parseZone().utcOffset();
            value = moment(curTime).utcOffset(utc).format();
          } else if (variableType === "NUM") {
            value = cbk.getElementValue("numVariableValue");
          } else if (variableType === "FILE") {
            value = cbk.getElementValue("fileVariableValue");
          } else if (variableType === "DOC") {
            if (
              cbk.getElementValue("docTemplateType") ===
              "existing_document_variable"
            ) {
              const docVar = cbk.getElementValue("existingDocVariableValue");
              value = cbk.getVariableDocValue(docVar);
            } else {
              value = cbk.getElementValue("docVariableValue");
            }
          } else if (variableType === "CBX") {
            value = cbk.getElementValue("checkboxVariableValue");
          } else if (variableType === "RAD") {
            value = cbk.getElementValue("radioVariableValue");
          } else {
            value = cbk.getElementValue("variableValue");
          }

          cbk.setOutput(createVariable, value);
          break;
        case "update":
          const updateVariable = cbk.getElementValue("update_variable_name");
          const updateVarType = cbk.getVariableType(updateVariable);
          let updated = "";
          cbk.log("UPDATE VAR NAME", updateVariable);
          cbk.log("UPDATE VAR TYPE", updateVarType);

          if (updateVarType === "DATE") {
            const updateDate = cbk.getElementValue("update_date");
            const utc = moment(updateDate).parseZone().utcOffset();
            updated = moment(updateDate).utcOffset(utc).format();
          } else if (updateVarType === "NUM") {
            updated = cbk.getElementValue("update_num");
          } else if (updateVarType === "FILE") {
            updated = cbk.getElementValue("update_file");
          } else if (updateVarType === "DOC") {
            if (
              cbk.getElementValue("updateDocTemplateType") ===
              "existing_document_variable"
            ) {
              const docVar = cbk.getElementValue("existing_update_doc");
              updated = cbk.getVariableDocValue(docVar);
            } else {
              updated = cbk.getElementValue("update_doc");
            }
          } else if (updateVarType === "CBX") {
            updated = cbk.getElementValue("update_checkbox");
          } else if (updateVarType === "RAD") {
            updated = cbk.getElementValue("update_radio");
          } else {
            updated = cbk.getElementValue("update_value");
          }

          cbk.log("UPDATE VAR VALUE", updated);
          if (cbk.hasInput(updateVariable)) {
            cbk.overwriteInput(updateVariable, updated);
          } else {
            cbk.setOutput(updateVariable, updated);
          }
          break;
        case "format":
          const selectedVariable = cbk.getElementValue(
            "selected_variable_name"
          );
          const overrideVariable = cbk.getElementValue("override_variable");
          const newFormattedVariable = cbk.getElementValue("new_variable_name");
          const concatenatedVariable = cbk.getElementValue(
            "concatenated_variable"
          );

          const commonSuffix = cbk.getElementValue("ending_suffix");
          const secondLastSuffix = cbk.getElementValue("second_last_suffix");
          const lastSuffix = cbk.getElementValue("last_suffix");

          const listInfo = cbk.getVariable(selectedVariable) as string[];

          let concatenatedResult = "";

          const formatList = (list: string[]) => {
            if (!commonSuffix && !secondLastSuffix && !lastSuffix) {
              concatenatedResult = list.join("");
              return list;
            }

            if (list.length === 0) {
              concatenatedResult = "";
              return [];
            }

            if (list.length === 1) {
              concatenatedResult = `${list[0]}${lastSuffix}`;
              return [`${list[0]}${lastSuffix}`];
            }

            const formattedList = list.map((item, index) => {
              if (index === list.length - 1) {
                concatenatedResult += list[index] + lastSuffix;
                return `${item}${lastSuffix}`;
              } else if (index === list.length - 2) {
                concatenatedResult +=
                  list[index] + (secondLastSuffix || commonSuffix);
                return `${item}${secondLastSuffix || commonSuffix}`;
              } else {
                concatenatedResult += list[index] + commonSuffix;
                return `${item}${commonSuffix}`;
              }
            });

            return formattedList;
          };

          const formattedList = formatList(listInfo);
          cbk.log("Pre-formatted List", listInfo);
          cbk.log("Formatted List", formattedList);
          cbk.log("Common Suffix", commonSuffix);
          cbk.log("Suffix for second last item", secondLastSuffix);
          cbk.log("Suffix for last item", lastSuffix);

          if (overrideVariable === "false") {
            cbk.log("Override is false, creating a new variable");
            cbk.setOutput(newFormattedVariable, formattedList);
          } else {
            cbk.log("Override is true, updating existing variable");
            cbk.setOutput(selectedVariable, formattedList);
          }

          if (concatenatedVariable) {
            cbk.log("Creating concatenated variable");
            cbk.setOutput(concatenatedVariable, concatenatedResult);
          }

          break;
        case "formatDate":
          const selectedDateVariableName = cbk.getElementValue(
            "selected_date_variable_name"
          );

          const selectedDateVariableValue = cbk.getVariable(
            selectedDateVariableName
          );

          const newFormattedDateVariable = cbk.getElementValue(
            "format_date_variable_name"
          );

          cbk.log("Selected Date Variable Name: ", selectedDateVariableName);
          cbk.log("Selected Date Variable Value: ", selectedDateVariableValue);
          cbk.log("New Formatted Date Variable: ", newFormattedDateVariable);

          const utc = moment(selectedDateVariableValue).parseZone().format();
          const updatedDate = moment(selectedDateVariableValue)
            .utcOffset(utc)
            .format();
          cbk.log("Updated Date Value: ", updatedDate);
          cbk.log("UTC: ", utc);

          cbk.setOutput(newFormattedDateVariable, updatedDate);
          break;
      }
    },
  };
}
