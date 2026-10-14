import { expect, test } from "@playwright/test";

test("smoke: o jogo abre e permite iniciar uma partida", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Caça-Bug" })).toBeVisible();
  await expect(page.getByTestId("versao")).toContainText("versão");
  await page.getByTestId("iniciar").click();
  await expect(page.getByTestId("linha-0")).toBeVisible();
});
