import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./HelloWorld.module.scss";
import { IHelloWorldProps } from "./IHelloWorldProps";
import { IItem } from "@pnp/sp/items/types";
import { useBoolean } from "@fluentui/react-hooks";
import { IAttachmentInfo } from "@pnp/sp/attachments";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react/lib/Dialog";
import {
  TextField,
  DefaultButton,
  ITextFieldStyles,
  Dropdown,
  IDropdownOption,
  defaultDatePickerStrings,
  DatePicker,
  IDropdownStyles,
  Panel,
  getTheme,
  mergeStyleSets,
  FontWeights,
  IIconProps,
} from "@fluentui/react";
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import { IItemAddResult } from "@pnp/sp/items";
import {
  FilePicker,
  IFilePickerResult,
} from "@pnp/spfx-controls-react/lib/FilePicker";

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: "100%", marginBottom: "5px" },
};

const textFieldStyles: Partial<ITextFieldStyles> = {
  fieldGroup: { width: "100%", marginBottom: "5px" },
};

const theme = getTheme();

const contentStyles = mergeStyleSets({
  containerRick: {
    width: "90%",
    heigth: "90%",
    display: "flex",
    overflowY: "hidden",
  },

  minimo: [
    // eslint-disable-next-line deprecation/deprecation
    theme.fonts.xLargePlus,
    {
      gap: "10px",
      display: "flex",
      width: "120px",
      height: "120px",
      alignItems: "center",
      justifyContent: "spaceAround",
    },
  ],

  header: [
    // eslint-disable-next-line deprecation/deprecation
    theme.fonts.xLargePlus,
    {
      flex: "1 1 auto",
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: "flex",
      alignItems: "center",
      fontWeight: FontWeights.semibold,
      padding: "12px 12px 14px 24px",
      border: "none",
    },
  ],
  body: {
    flex: "4 4 auto",
    padding: "0 24px 24px 24px",
    overflowY: "hidden",
    selectors: {
      p: { margin: "14px 0" },
      "p:first-child": { marginTop: 0 },
      "p:last-child": { marginBottom: 0 },
    },
  },
});

const addIcon: IIconProps = { iconName: "Add" };

const dialogContentProps = {
  type: DialogType.normal,
  title: "Deseja mesmo apagar o Personagem??",
};

const dialogModalProps = {
  isBlocking: true,
  styles: { main: { maxWidth: 450 } },
};
const optionsLang: IDropdownOption[] = [];

const HelloWorld: React.FunctionComponent<IHelloWorldProps> = (props) => {
  const sp = spfi().using(spSPFx(props.context));

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);

  const [
    isOpenCreate,
    { setTrue: openPanelCreate, setFalse: dismissPanelCreate },
  ] = useBoolean(false);

  const [isDialogVisible, setIsDialogVisible] = React.useState(false);

  const [db, setdb] = useState([]);
  const [dbLang, setdbLang] = useState([]);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [lang, setLang] = React.useState<IDropdownOption>();

  const [updateUserId, setUpdateUserId] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateImage, setUpdateImage] = useState("");
  const [updateDate, setUpdateDate] = useState<Date | undefined>();
  const [updateLang, setUpdateLang] = React.useState<IDropdownOption>();

  const [file, setFile] = useState([]);

  const meuInit = async () => {
    const items: any[] = await sp.web.lists.getByTitle("Person").items();
    setdb(items);
  };

  const myLangInit = async () => {
    const langListGlobal: any[] = await sp.web.lists
      .getByTitle("Lang List")
      .items();
    langListGlobal.map((e) => {
      optionsLang.push({
        key: e.Title,
        text: e.Title,
      });
    });
    setdbLang(langListGlobal);
  };

  const onDismiss = React.useCallback(
    (ev?: React.SyntheticEvent | KeyboardEvent) => {
      if (ev) {
        // Instead of closing the panel immediately, cancel that action and show a dialog
        ev.preventDefault();
        setIsDialogVisible(true);
      }
    },
    []
  );

  const hideDialog = React.useCallback(() => setIsDialogVisible(false), []);

  const changeName = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setName(newValue || "");
    },
    []
  );

  const changeImage = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setImage(newValue || "");
    },
    []
  );

  const changeLang = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    setLang(item);
  };

  const changeUpdateName = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      if (!newValue || newValue.length) {
        setUpdateName(newValue || "");
      }
    },
    []
  );

  const changeUpdateImage = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setUpdateImage(newValue || "");
    },
    []
  );

  const changeUpdateLang = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    setUpdateLang(item);
  };

  const createValue = async () => {
    const resultLang = dbLang.filter((e) => e.Title === lang.text);
    const value = {
      Title: name,
      Imagem: image,
      Aniversario: date.toISOString(),
      LinguagemId: resultLang[0].ID,
    };
    const iar: IItemAddResult = await sp.web.lists
      .getByTitle("Person")
      .items.add(value);
    meuInit();
    setName("");
    setImage("");
    setDate(undefined);
    setLang(undefined);
    dismissPanelCreate();
  };

  const updateValue = async () => {
    const list = sp.web.lists.getByTitle("Person");
    const item: any = await sp.web.lists
      .getByTitle("Person")
      .items.getById(Number(updateUserId))();
    const filterLang = dbLang.filter((e) => e?.Title === updateLang?.text);
    const i = await list.items.getById(Number(updateUserId)).update({
      Title: updateName ? updateName : item?.Title,
      Imagem: updateImage ? updateImage : item?.Imagem,
      Aniversario: updateDate ? updateDate.toISOString() : item?.Aniversario,
      LinguagemId: filterLang[0]?.Id ? filterLang[0]?.Id : item?.LinguagemID,
    });
    meuInit();
    dismissPanel();
  };

  const deleteValue = async () => {
    const list = sp.web.lists.getByTitle("Person");
    await list.items.getById(Number(updateUserId)).delete();
    meuInit();
  };

  const changeValue = async (id: number) => {
    const item: any = await sp.web.lists
      .getByTitle("Person")
      .items.getById(id)();
    setUpdateUserId(item.Id);
    setUpdateName(item.Title);
    setUpdateImage(item.Imagem);
    const dateItem = item.Aniversario.split("-");
    const newDate = new Date(
      `${dateItem[0]}/${dateItem[1]}/${dateItem[2][0]}${dateItem[2][1]}`
    );
    setUpdateDate(newDate);
    const dbLangUpdate = dbLang.filter((e) => e.Id === item.LinguagemId);
    setLang(dbLangUpdate[0].Title);
  };

  // PEGANDO OS DADOS PARA O BANCO DE DADOS!

  useEffect(() => {
    meuInit();
    myLangInit();
  }, []);

  const pickAllFile = async () => {
    const pickFile: IItem = sp.web.lists
      .getByTitle("Person")
      .items.getById(Number(updateUserId));
    const file: IAttachmentInfo[] = await pickFile.attachmentFiles();
    setAllFile(file);
    meuInit();
  };

  // const updateFile = async () => {
  //   const item: IItem = sp.web.lists
  //     .getByTitle("Banner")
  //     .items.getById(1);
  //   await item.attachmentFiles
  //     .getByName(`banner.png`)
  //     .setContent(`${newContent}`);
  //   setUpdateNameFile("");
  //   setNewContent("");
  // };

  // const deleteFile = async (name: string) => {
  //   const item: IItem = sp.web.lists
  //     .getByTitle("Person")
  //     .items.getById(Number(updateUserId));
  //   await item.attachmentFiles.getByName(name).delete();
  // };

  // const recycleFile = async () => {
  //   const item: IItem = sp.web.lists.getByTitle("Person").items.getById(26);
  //   await item.attachmentFiles.getByName("file3.txt").recycle();
  // };

  const onFilePickerSave = async (filePickerResult: IFilePickerResult[]) => {
    const item: IItem = sp.web.lists
      .getByTitle("Person")
      .items.getById(Number(updateUserId));
    const oFile = filePickerResult;
    oFile.map(async (e) => {
      const fileResultContent = await e.downloadFileContent();
      await item.attachmentFiles.add(fileResultContent.name, fileResultContent);
    });
  };

  return (
    <div>
      <div className={styles.personcenter}>
        <section className={styles.containerPerson}>
          {db.map((item) => {
            return (
              <div className={styles.divPerson} key={item.Id}>
                <img className={styles.imgPerson} src={item.Imagem} />
                <h2 className={styles.titlePerson}>{item.Title}</h2>
                <DefaultButton
                  onClick={() => {
                    changeValue(item.Id);
                    openPanel();
                  }}
                  text="Atualizar"
                />
              </div>
            );
          })}
          <DefaultButton
            onClick={openPanelCreate}
            className={styles.buttonMore}
            iconProps={addIcon}
          />
        </section>
      </div>

      {/* PANELS */}

      {/* CREATE */}

      <Panel
        headerText="Criar Dados"
        isOpen={isOpenCreate}
        onDismiss={dismissPanelCreate}
        closeButtonAriaLabel="Close"
        isLightDismiss
      >
        <h2>Create</h2>
        <TextField
          type="text"
          onChange={changeName}
          label="Nome"
          value={name}
          styles={textFieldStyles}
          placeholder="Insira o None"
        />
        <TextField
          onChange={changeImage}
          label="Imagem"
          value={image}
          styles={textFieldStyles}
          placeholder="Imagem Url"
        />
        <div>
          <DatePicker
            label="Aniversário"
            ariaLabel="Select a date"
            value={date}
            onSelectDate={setDate as (date: Date | null | undefined) => void}
            strings={defaultDatePickerStrings}
            styles={textFieldStyles}
          />
        </div>
        <Dropdown
          label="Idioma"
          selectedKey={lang ? lang.key : undefined}
          onChange={changeLang}
          placeholder={"Insira um Valor"}
          options={optionsLang}
          styles={dropdownStyles}
        />
        <DefaultButton onClick={createValue} text="Create" />
      </Panel>

      {/* UPDATE */}
      <div>
        <Panel
          className={styles.minIndex}
          headerText="Editar Dados"
          onDismiss={dismissPanel}
          isOpen={isOpen}
          closeButtonAriaLabel="Close"
        >
          <button onClick={pickAllFile}>Teste</button>
          <h2>Atualizar Dados</h2>
          {/* <TextField
            onChange={changeUpdateName}
            label="Update User ID"
            value={updateUserId}
            styles={textFieldStyles}
            placeholder="Insira o ID do item a ser editado."
            readOnly
          /> */}
          <TextField
            onChange={changeUpdateName}
            label="Nome"
            value={updateName}
            styles={textFieldStyles}
          />
          <TextField
            onChange={changeUpdateImage}
            label="Imagem"
            value={updateImage}
            styles={textFieldStyles}
            placeholder="Imagem Url"
          />
          <div>
            <DatePicker
              label="Aniversário"
              allowTextInput
              ariaLabel="Select a date"
              value={updateDate}
              onSelectDate={
                setUpdateDate as (updatedate: Date | null | undefined) => void
              }
              strings={defaultDatePickerStrings}
            />
          </div>
          <Dropdown
            label="Idioma"
            selectedKey={lang ? lang.key : undefined}
            onChange={changeUpdateLang}
            placeholder={`${lang}`}
            options={optionsLang}
            styles={dropdownStyles}
          />
          <div className={styles.divisor}>
            <DefaultButton onClick={updateValue} text="Atualizar" />
            <button className={styles.botaoDelete} onClick={onDismiss}>
              Deletar
            </button>
          </div>
          <div>
            <FilePicker
              bingAPIKey="<BING API KEY>"
              accepts={[
                ".gif",
                ".jpg",
                ".jpeg",
                ".bmp",
                ".dib",
                ".tif",
                ".tiff",
                ".ico",
                ".png",
                ".jxr",
                ".svg",
              ]}
              buttonIcon="FileImage"
              onSave={(filePickerResult: IFilePickerResult[]) => {
                onFilePickerSave(filePickerResult);
              }}
              onChange={(filePickerResult: IFilePickerResult[]) => {
                onFilePickerSave(filePickerResult);
              }}
              context={props.context}
            />
          </div>
          <Dialog
            hidden={!isDialogVisible}
            onDismiss={hideDialog}
            dialogContentProps={dialogContentProps}
            modalProps={dialogModalProps}
          >
            <DialogFooter>
              <DefaultButton onClick={deleteValue} text="Yes" />
              <DefaultButton onClick={hideDialog} text="No" />
            </DialogFooter>
          </Dialog>
        </Panel>
      </div>
    </div>
  );
};

export default HelloWorld;
