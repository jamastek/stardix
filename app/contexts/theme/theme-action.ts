import { ActionFunction, json } from "remix";
import { isTheme } from "./theme";
import { ThemeSessionResolver } from "./theme-session";

export const createThemeAction = (themeSessionResolver: ThemeSessionResolver): ActionFunction => {
  const action: ActionFunction = async ({request}) => {
    const session = await themeSessionResolver(request)
    const { theme } = await request.json()

    session.setTheme(theme)
    return json(
      {success: true},
      {headers: {"Set-Cookie": await session.commit()}}
    )
  }

  return action
}