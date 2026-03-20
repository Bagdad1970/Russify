export class RegisterPage {
  constructor(page) {
    this.page = page;

    
    this.profileButton = page.locator('.icon-user');
    this.favoritesButton = page.getByText('Избранное');

    
    this.modal = page.locator('.regm-overlay').first();

    
    this.nameInput     = page.locator('.regm-input[name="username"]');
    this.emailInput    = page.locator('.regm-input[name="email"]');
    this.passwordInput = page.locator('.regm-input[name="password"]');
    this.confirmInput  = page.locator('.regm-input[name="passwordConfirm"]');

   
    this.submitButton      = page.locator('.regm-register-btn');
    this.switchToLoginLink = page.locator('.regm-switch-btn');

    
    this.errorMessage = page.locator('.error, .error-message');
  }

  async goto() {
    await this.page.goto('http://russify.k-lab.su');
  }

  async openViaProfile() {
    await this.profileButton.click();
    await this.modal.waitFor({ state: 'visible' });
  }

  async register({ name, email, password }) {
    await this.nameInput.waitFor({ state: 'visible' });
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmInput.fill(password);
    await this.submitButton.click();
  }

  async registerViaProfile({ name, email, password }) {
    await this.openViaProfile();
    await this.register({ name, email, password });
  }
}