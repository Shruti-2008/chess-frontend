/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        spot_b: "url('../public/assets/images/spot_b.png')",
        spot_w: "url('../public/assets/images/spot_w.png')",
        king_b: "url('../public/assets/images/king_b.png')",
        king_w: "url('../public/assets/images/king_w.png')",
        knight_b: "url('../public/assets/images/knight_b.png')",
        knight_w: "url('../public/assets/images/knight_w.png')",
        pawn_b: "url('../public/assets/images/pawn_b.png')",
        pawn_w: "url('../public/assets/images/pawn_w.png')",
        queen_b: "url('../public/assets/images/queen_b.png')",
        queen_w: "url('../public/assets/images/queen_w.png')",
        rook_b: "url('../public/assets/images/rook_b.png')",
        rook_w: "url('../public/assets/images/rook_w.png')",
        bishop_b: "url('../public/assets/images/bishop_b.png')",
        bishop_w: "url('../public/assets/images/bishop_w.png')",
        back_button: "url('../public/assets/images/back_button.png')",
        back_button_hover:
          "url('../public/assets/images/back_button_hover.png')",
        chess_logo_black: "url('../public/assets/images/chess_logo_black.png')",
        chess_logo_white: "url('../public/assets/images/chess_logo_white.png')",
        close: "url('../public/assets/images/close.png')",
        close_hover: "url('../public/assets/images/close_hover.png')",
        draw: "url('../public/assets/images/draw.png')",
        menu_hover_thin: "url('../public/assets/images/menu_hover_thin.png')",
        menu_hover_thick: "url('../public/assets/images/menu_hover_thick.png')",
        menu: "url('../public/assets/images/menu.png')",
        resign: "url('../public/assets/images/resign.png')",
        right_arrow: "url('../public/assets/images/right-arrow.png')",
        user_slate_200: "url('../public/assets/images/user_slate_200.png')",
        user_slate_300: "url('../public/assets/images/user_slate_300.png')",
        user_slate_400: "url('../public/assets/images/user_slate_400.png')",
        user: "url('../public/assets/images/user.png')",
        valid_pos: "url('../public/assets/images/valid_pos.png')",
        valid_pos_capture:
          "url('../public/assets/images/valid_pos_capture.png')",
        highlight_tint:
          "linear-gradient(rgb(253, 230, 148, 0.45), rgb(253, 230, 148, 0.45))",
        checked_tint:
          "linear-gradient(rgb(248, 113, 113, 1), rgb(248, 113, 113, 1))",
      },
      keyframes: {
        enter: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0.9)", opacity: 0 },
        },
      },
      animation: {
        enter: "enter 0.4s ease-out",
        leave: "leave 0.4s ease-in forwards",
      },
      fontSize: {
        "10xl": "10rem",
        "12xl": "12rem",
      },
    },
  },
  plugins: [],
};
