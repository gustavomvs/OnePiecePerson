import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./HelloWorld.module.scss";
import { IHelloWorldProps } from "./IHelloWorldProps";
import { IItem, Item } from "@pnp/sp/items/types";
import { useBoolean } from "@fluentui/react-hooks";
import { IAttachmentInfo } from "@pnp/sp/attachments";
import {
  TextField,
  DefaultButton,
  ITextFieldStyles,
  Stack,
  Dropdown,
  IDropdownOption,
  defaultDatePickerStrings,
  DatePicker,
  IDropdownStyles,
  Panel,
  Modal,
  getTheme,
  mergeStyleSets,
  FontWeights,
  IIconProps,
  PrimaryButton,
} from "@fluentui/react";
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import { IItemAddResult } from "@pnp/sp/items";
import { IconButton } from "office-ui-fabric-react";

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: "100%", marginBottom: "5px" },
};

const textFieldStyles: Partial<ITextFieldStyles> = {
  fieldGroup: { width: "100%", marginBottom: "5px" },
};

const cancelIcon: IIconProps = { iconName: "Cancel" };

const theme = getTheme();

const contentStyles = mergeStyleSets({
  containerRick: {
    width: "90%",
    heigth: "90%",
    display: "flex",
  },

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

const iconButtonStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: "auto",
    marginTop: "4px",
    marginRight: "2px",
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};

const optionsLang: IDropdownOption[] = [];

const HelloWorld: React.FunctionComponent<IHelloWorldProps> = (props) => {
  const sp = spfi().using(spSPFx(props.context));

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);

  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);

  const [isModalOpenRick, { setTrue: showModalRick, setFalse: hideModalRick }] =
    useBoolean(false);

  const [db, setdb] = useState([]);
  const [dbLang, setdbLang] = useState([]);
  const [rmdb, setrmdb] = useState([]);

  const [pages, setPages] = useState(1);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [lang, setLang] = React.useState<IDropdownOption>();

  const [updateUserId, setUpdateUserId] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateImage, setUpdateImage] = useState("");
  const [updateDate, setUpdateDate] = useState<Date | undefined>();
  const [updateLang, setUpdateLang] = React.useState<IDropdownOption>();

  const [createLang, setCreateLang] = useState("");

  const [deletedUserId, setDeletedUserId] = useState("");

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

  const myRickInit = () => {
    fetch(`https://rickandmortyapi.com/api/character?page=${pages}`)
      .then((response) => response.json())
      .then((response) => setrmdb(response.results));
  };

  document.addEventListener("keydown", (event) => {
    const keyName = event.key;
    if (keyName === "Escape") {
      hideModalRick();
      hideModal();
    }
  });

  const rickandmortymore = () => {
    if (pages < 43) {
      setPages(pages + 1);
    }
    myRickInit();
  };

  const rickandmortyless = () => {
    if (pages > 1) {
      setPages(pages - 1);
    }
    myRickInit();
  };

  const leituraDeIdiomas = async () => {
    showModal();
  };

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

  const changeDeleteValue = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setDeletedUserId(newValue || "");
    },
    []
  );

  const changeCreateLang = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setCreateLang(newValue || "");
    },
    []
  );

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
  };

  const readValue = async () => {
    meuInit();
    console.log(db);
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
  };

  const deleteValue = async () => {
    const list = sp.web.lists.getByTitle("Person");
    await list.items.getById(Number(deletedUserId)).delete();
    meuInit();
  };

  const deleteOneClcik = async (id: number) => {
    const list = sp.web.lists.getByTitle("Person");
    await list.items.getById(id).delete();
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

  const createLangdb = () => {
    // dbLang.map((e) => {
    //   console.log(
    //     e.Title.normalize("NFD")
    //       .replace(/[\u0300-\u036f]/g, "")
    //       .toLowerCase()
    //   );
    // });
  };

  useEffect(() => {
    meuInit();
    myLangInit();
    myRickInit();
    // addFile();
    // readFile();
    // pickAllFile();
    // updateFile();
    //deleteFile();
    //recycleFile();
  }, []);

  useEffect(() => {
    myRickInit();
  }, [pages]);

  const pickFile: IItem = sp.web.lists.getByTitle("Person").items.getById(26);

  const pickAllFile = async () => {
    const file: IAttachmentInfo[] = await pickFile.attachmentFiles();
    console.log(file);
  };

  const addFile = async () => {
    const file: IItem = sp.web.lists.getByTitle("Person").items.getById(26);
    await file.attachmentFiles.add("file3.txt", "Here is my content3");
    await file.attachmentFiles.add("file4.txt", "Here is my content4");
    const info: IAttachmentInfo[] = await file.attachmentFiles();
  };

  const readFile = async () => {
    const item: IItem = sp.web.lists.getByTitle("Person").items.getById(26);
    const text = await item.attachmentFiles.getByName("file2.txt").getText();
    console.log(text);
  };

  const updateFile = async () => {
    const item: IItem = sp.web.lists.getByTitle("Person").items.getById(26);
    await item.attachmentFiles
      .getByName("file2.txt")
      .setContent("Testando novo conteudo");
  };

  const deleteFile = async () => {
    const item: IItem = sp.web.lists.getByTitle("Person").items.getById(26);
    await item.attachmentFiles.getByName("file4.txt").delete();
  };

  const recycleFile = async () => {
    const item: IItem = sp.web.lists.getByTitle("Person").items.getById(26);
    await item.attachmentFiles.getByName("file3.txt").recycle();
  };

  return (
    <div>
      <Panel
        headerText="Editar Dados"
        isOpen={isOpen}
        onDismiss={dismissPanel}
        closeButtonAriaLabel="Close"
      >
        <h2>Update</h2>
        <TextField
          onChange={changeUpdateName}
          label="Update User ID"
          value={updateUserId}
          styles={textFieldStyles}
          placeholder="Insira o ID do item a ser editado."
          readOnly
        />
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
            onChange={() => console.log("Hello")}
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
        <DefaultButton onClick={updateValue} text="Update" />
      </Panel>
      <button onClick={leituraDeIdiomas}>Leitura de Idiomas</button>
      <Modal isOpen={isModalOpen} isModeless={true}>
        <div className={contentStyles.header}>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={hideModal}
          />
        </div>
        <div className={contentStyles.body}>
          {dbLang.map((e) => {
            return <p key={e.Id}>{e.Title}</p>;
          })}
        </div>
      </Modal>
      <section className={styles.containerPerson}>
        {db.map((item) => {
          return (
            <div className={styles.divPerson} key={item.Id}>
              <img
                className={styles.imgPerson}
                onClick={() => {
                  changeValue(item.Id);
                  openPanel();
                }}
                src={item.Imagem}
              />
              <h2 className={styles.titlePerson}>{item.Title}</h2>
              <DefaultButton
                onClick={() => deleteOneClcik(item.Id)}
                text="Delete"
              />
            </div>
          );
        })}
      </section>
      <Stack>
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
        <h2>Read</h2>
        <DefaultButton onClick={readValue} text="Read" />
        <h2>Delete</h2>
        <TextField
          onChange={changeDeleteValue}
          label="Delete User"
          value={deletedUserId}
          styles={textFieldStyles}
          placeholder="Insira o ID a ser deletado"
        />
        <DefaultButton onClick={deleteValue} text="Delete" />
        <Modal
          isOpen={isModalOpenRick}
          isModeless={true}
          containerClassName={contentStyles.containerRick}
        >
          <div className={contentStyles.header}>
            <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={hideModalRick}
            />
          </div>
          <div>
            <div className={styles.rickflex}>
              {rmdb.map((e) => {
                return (
                  <div className={styles.rickbottom} key={e.id}>
                    <div className={styles.ricktext}>{e.name}</div>
                    <img className={styles.rickimg} src={e.image} alt="" />
                  </div>
                );
              })}
            </div>
            <div className={styles.rickflex2}>
              <DefaultButton
                onClick={() => rickandmortyless()}
                className={styles.clickright}
                text="Retornar"
              />
              <DefaultButton
                onClick={() => rickandmortymore()}
                className={styles.clickleft}
                text="Avançar"
              />
            </div>
          </div>
        </Modal>
        <DefaultButton
          onClick={() => {
            showModalRick();
          }}
          text="Hey Rick"
        />
      </Stack>
      <Stack>
        <h1>Criar Idioma</h1>
        <TextField
          onChange={changeCreateLang}
          label="Idioma"
          value={createLang}
          styles={textFieldStyles}
          placeholder="Insira o idioma"
        />
        <DefaultButton onClick={createLangdb} text="Criar Idioma" />
      </Stack>
    </div>
  );
};

export default HelloWorld;
