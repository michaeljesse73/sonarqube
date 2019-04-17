/*
 * SonarQube
 * Copyright (C) 2009-2019 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
package org.sonar.application.es;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.rules.TemporaryFolder;

import static org.assertj.core.api.Assertions.assertThat;

public class EsYmlSettingsTest {

  @Rule
  public TemporaryFolder temp = new TemporaryFolder();
  @Rule
  public ExpectedException expectedException = ExpectedException.none();

  @Test
  public void test_generation_of_file() throws IOException {
    File yamlFile = temp.newFile();
    new EsYmlSettings(new HashMap<>()).writeToYmlSettingsFile(yamlFile);

    assertThat(yamlFile).exists();
    assertThat(yamlFile).hasContent("# This file has been automatically generated by SonarQube during startup.\n" +
      "\n" +
      "# DO NOT EDIT THIS FILE\n" +
      "\n" +
      "{\n" +
      "  }");
  }

  @Test
  public void if_file_is_not_writable_ISE_must_be_thrown() throws IOException {
    File yamlFile = temp.newFile();
    yamlFile.setReadOnly();

    expectedException.expect(IllegalStateException.class);
    expectedException.expectMessage("Cannot write Elasticsearch yml settings file");

    new EsYmlSettings(new HashMap<>()).writeToYmlSettingsFile(yamlFile);
  }
}
