import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getLanguages = createAsyncThunk(
  'translate/getLanguages',
  async () => {
    const options = {
      method: 'GET',
      url: 'https://text-translator2.p.rapidapi.com/getLanguages',
      headers: {
        'X-RapidAPI-Key': '75dc092df0msh3c03138e5cc1ea2p19035ejsn916bcc592247',
        'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com',
      },
    };

    const res = await axios.request(options);

    return res.data.data.languages.map((lang) => ({
      value: lang.code,
      label: lang.name,
    }));
  }
);

export const getAnswer = createAsyncThunk(
  'translate/getAnswer',
  async (props) => {
    console.log(props);
    const encodedParams = new URLSearchParams();
    encodedParams.append('source_language', props.sourceLang.value);
    encodedParams.append('target_language', props.targetLang.value);
    encodedParams.append('text', props.prompt);

    const options = {
      method: 'POST',
      url: 'https://text-translator2.p.rapidapi.com/translate',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': '75dc092df0msh3c03138e5cc1ea2p19035ejsn916bcc592247',
        'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com',
      },
      data: encodedParams,
    };

    const res = await axios.request(options);

    console.log(res.data.data.translatedText);

    return res.data.data.translatedText;
  }
);

const initialState = {
  answer: '',
  languages: [],
  isLoading: false,
  isError: false,
};

export const translateSlice = createSlice({
  name: 'translate',
  initialState,
  //   thunkta reducers yerine extraReducers kullanılır
  extraReducers: {
    // bekleme durumunda (henüz cevap gelmiyorken) çalışır
    [getAnswer.pending]: (state) => {
      state.isLoading = true;
      state.isError = false;
    },
    // eğer veri gelirse çaılışır
    [getAnswer.fulfilled]: (state, action) => {
      state.answer = action.payload;
      state.isLoading = false;
      state.isError = false;
    },
    // eğer veri gelirken bir hata oluşursa çaılışır
    [getAnswer.rejected]: (state) => {
      state.isLoading = false;
      state.isError = true;
    },
    // eğer diller çekilirken başarılı cevap gelirse
    [getLanguages.fulfilled]: (state, action) => {
      state.languages = action.payload;
    },
  },
});

export default translateSlice.reducer;

//  extraReducers: (builder) => {
//     builder.addCase(getAnswer.pending, (state) => {
//       state.isLoading = true;
//     });
//     builder.addCase(getAnswer.fulfilled, (state, action) => {
//       state.answer = action.payload;
//       state.isLoading = false;
//     });
//     builder.addCase(getLanguages.fulfilled, (state, action) => {
//       state.languages = action.payload;
//     });
//   },
