import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    textStyle:{
        fontSize: 30,
        color: "black",
        textAlign: "center"
    },
    viewStyle:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    buttonStyle:{
        width: '50%',
        borderRadius: 20,
        marginBottom: 10
    },
    viewStyle:{
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    mainContainer: {
        backgroundColor: 'white',
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    smallIcon: {
        marginRight: 10,
        fontSize: 24,
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: 260,
        width: 260,
        marginTop: 30,
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18,
    },
    action: {
        flexDirection: 'row',
        paddingTop: 14,
        paddingBottom: 3,
        marginTop: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#38AEE6',
        borderRadius: 50,
    },
    textInput: {
        flex: 1,
        marginTop: -12,
        color: '#05375a',
    },
    loginContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    header: {
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
    },
    text_header: {
        color: '#38AEE6',
        fontWeight: 'bold',
        fontSize: 30,
    },
    button: {
        alignItems: 'center',
        marginTop: -20,
        alignItems: 'center',
        textAlign: 'center',
        margin: 20,
    },
    inBut: {
        width: '70%',
        backgroundColor: '#38AEE6',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 50,
    },
    inBut2: {
        backgroundColor: '#38AEE6',
        height: 65,
        width: 65,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomButton: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallIcon2: {
        fontSize: 40,
        // marginRight: 10,
    },
    bottomText: {
        color: 'black',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 5,
    },
    click_footer: {
        fontWeight: '700'
    },
    click_footer_two: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    click_footer_view: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginTop: 8,
        marginRight: 10,
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 12,
    },
    dateOfBirthContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
      },
      datePicker: {
        flex: 1,
        height: 50,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
      },
      disabledButton: {
        backgroundColor: 'gray',
      },editIcon: {
        zIndex: 1,
        color: 'white',
        position: 'absolute',
        right: 2,
        margin: 15,
      },
      backIcon: {
        zIndex: 1,
        color: 'white',
        position: 'absolute',
        left: 2,
        margin: 15,
      },
      avatar: {
        borderRadius: 100,
        marginTop: -250,
        // marginLeft: 105,
        backgroundColor: 'white',
        height: 200,
        width: 200,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
      },
      nameText: {
        color: 'black',
        fontSize: 28,
        fontStyle: 'normal',
        fontFamily: 'Open Sans',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      bookCountMain: {
        borderColor: '#b0b0b0',
        borderWidth: 1,
        marginTop: 18,
        marginHorizontal: 20,
    
        borderRadius: 20,
        flexDirection: 'row',
        width: '88%',
      },
      bookCount: {
        width: '50%',
        borderColor: '#b0b0b0',
        borderRightWidth: 1,
        flexDirection: 'column',
        paddingHorizontal: 10,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
      },
      bookCountNum: {
        color: '#5D01AA',
        fontSize: 34,
        fontWeight: '800',
      },
      bookCountText: {color: '#b3b3b3', fontSize: 14, fontWeight: '500'},
      infoMain: {
        marginTop: 10,
      },
      infoCont: {
        width: '100%',
        flexDirection: 'row',
      },
      infoIconCont: {
        justifyContent: 'center',
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        elevation: -5,
        borderColor: 'black',
        backgroundColor: 'black',
      },
      infoText: {
        width: '80%',
        flexDirection: 'column',
        marginLeft: 25,
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderColor: '#e6e6e6',
      },
      infoSmall_Text: {
        fontSize: 13,
        color: '#b3b3b3',
        fontWeight: '500',
      },
      infoLarge_Text: {
        color: 'black',
        fontSize: 18,
        fontWeight: '600',
      },
      booksUploadedMain: {
        paddingHorizontal: 10,
        paddingBottom: 30,
        marginTop: 20,
      },
      flatlistDiv: {
        borderRadius: 15,
        paddingHorizontal: 10,
      },
      booksUploadedText: {
        fontSize: 26,
        color: 'black',
        fontWeight: '700',
        paddingLeft: 20,
        paddingBottom: 8,
      },
      booksUploadedCard: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 9,
        marginBottom: 9,
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 15,
        elevation: 3,
      },
      booksUploadedImgDiv: {
        width: '28%',
      },
      booksUploadedImg: {
        width: '100%',
        height: 120,
        borderRadius: 15,
      },
      cardMidDiv: {
        paddingHorizontal: 10,
        width: '55%',
        position: 'relative',
      },
      approvedText: {
        fontSize: 12,
        color: '#0d7313',
        fontWeight: '600',
        marginLeft: 5,
      },
      cardBookNameText: {
        fontSize: 24,
        color: 'black',
        fontWeight: '700',
        marginTop: 2,
      },
      cardBookAuthor: {
        fontSize: 14,
        color: 'black',
        fontWeight: '600',
        marginTop: 1,
      },
      cardRating: {
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: 10,
        flexDirection: 'row',
      },
      cardRatingCount: {
        fontSize: 14,
        marginTop: -2,
        paddingLeft: 4,
        color: '#303030',
      },
      cardEditDiv: {
        width: '17%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      cardEditBtn: {
        height: 44,
        width: 44,
        backgroundColor: '#774BBC',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
      },
      footer: {
        padding: 10,
        justifyContent: 'center',
    
        flexDirection: 'row',
      },
      loadMoreBtn: {
        padding: 10,
        backgroundColor: '#f5a002',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        paddingHorizontal: 20,
      },
      btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '600',
      },
})

export default styles;